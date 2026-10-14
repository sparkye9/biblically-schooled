import { expect, test, type Page } from '@playwright/test'

// Thursday of Week 8 — a regular school day (Wednesday is co-op).
const THURSDAY = new Date('2026-10-15T09:00:00')

async function fresh(page: Page, date = THURSDAY) {
  await page.clock.setFixedTime(date)
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await expect(page.getByText('Today’s School')).toBeVisible()
}

function trackErrors(page: Page) {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  // Vercel Analytics' script only exists on Vercel itself; its local 404 is expected.
  page.on('console', (m) => m.type() === 'error' && !m.location().url.includes('/_vercel/') && errors.push(m.text()))
  return errors
}

test('Today shows all four children, the shared Bible lesson, and modes', async ({ page }) => {
  const errors = trackErrors(page)
  await fresh(page)
  await expect(page.getByRole('heading', { name: /Thursday, October 15, 2026/ })).toBeVisible()
  for (const name of ['Alijah', 'Olori-Joy', 'Seraiah', 'Amelia']) await expect(page.getByText(name, { exact: false }).first()).toBeVisible()
  await expect(page.getByText(/Bible · everyone together/)).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Seraiah & Amelia' })).toBeVisible()
  await page.getByRole('button', { name: /Minimum Day/ }).click()
  await expect(page.getByText(/together · 7 min/)).toBeVisible()
  await page.getByRole('button', { name: 'I need an easy day' }).click()
  await expect(page.getByText('Today’s 20-Minute Plan')).toBeVisible()
  expect(errors).toEqual([])
})

test('checking a lesson persists after reload and survives a mode switch', async ({ page }) => {
  await fresh(page)
  const box = page.getByRole('checkbox', { name: 'Bible done for Alijah' })
  await box.click()
  await expect(box).toHaveAttribute('aria-checked', 'true')
  await page.getByRole('button', { name: /Full Day/ }).click()
  await page.reload()
  await expect(page.getByRole('checkbox', { name: 'Bible done for Alijah' })).toHaveAttribute('aria-checked', 'true')
})

test('a missed day does not move the lesson; a taught day does', async ({ page }) => {
  await fresh(page)
  const header = page.getByText(/Week \d+ · Day \d of 4/)
  const before = await header.textContent()
  await page.clock.setFixedTime(new Date('2026-10-16T09:00:00'))
  await page.reload()
  await expect(page.getByText(/Week \d+ · Day \d of 4/)).toHaveText(before!) // nothing done Thursday → same lesson Friday
  await page.getByRole('checkbox', { name: 'Bible done for Alijah' }).click()
  await page.clock.setFixedTime(new Date('2026-10-19T09:00:00'))
  await page.reload()
  await expect(page.getByText(/Week \d+ · Day \d of 4/)).not.toHaveText(before!)
})

test('co-op day says so and offers to teach anyway', async ({ page }) => {
  await fresh(page, new Date('2026-10-14T09:00:00'))
  await expect(page.getByText('Wednesday is co-op day')).toBeVisible()
  await page.getByRole('button', { name: 'Do a lesson anyway' }).click()
  await expect(page.getByText(/Bible · everyone together/)).toBeVisible()
})

test('migrates saved data from the previous app version', async ({ page }) => {
  await page.clock.setFixedTime(THURSDAY)
  // Seed storage from a static page so the app can't save over it first.
  await page.goto('/offline.html')
  await page.evaluate(() => {
    localStorage.clear()
    localStorage.setItem(
      'biblically-schooled-v5',
      JSON.stringify({
        children: [
          { id: 'c-alijah', name: 'Alijah', grade: '1st Grade', gradeBand: '1st', householdId: 'h-venessa', color: 'child-alijah', childMode: true, lowDistraction: false },
          { id: 'c-test', name: 'Zion', grade: 'Kindergarten', gradeBand: 'k', householdId: 'h-venessa', color: 'child-olori', childMode: false, lowDistraction: false },
        ],
        readAloud: [{ id: 'b1', title: 'Charlotte’s Web', status: 'currently-reading', householdId: 'h-venessa' }],
        schoolYearStartDate: '2026-08-24',
      }),
    )
  })
  await page.goto('/')
  await expect(page.getByText('Welcome to the new Biblically Schooled.')).toBeVisible()
  await expect(page.getByText('Zion').first()).toBeVisible()
  await page.goto('/library')
  await expect(page.getByText('Charlotte’s Web')).toBeVisible()
  expect(await page.evaluate(() => !!localStorage.getItem('biblically-schooled-v5'))).toBe(true)
})

test('restart flow offers a welcome-back review after time away', async ({ page }) => {
  await fresh(page)
  await page.getByRole('checkbox', { name: 'Bible done for Alijah' }).click()
  await page.clock.setFixedTime(new Date('2026-11-02T09:00:00'))
  await page.reload()
  await expect(page.getByText(/Welcome back! It’s been/)).toBeVisible()
  await page.getByRole('link', { name: /We’re starting again/ }).click()
  await page.getByRole('button', { name: /welcome-back review day/ }).click()
  await expect(page.getByText(/Welcome-back review day/)).toBeVisible()
})

test('print packet: every worksheet page renders fully, with pictures, and as a PDF', async ({ page }) => {
  await fresh(page)
  await page.goto('/print/packet?week=8&children=c-alijah,c-olori,c-seraiah,c-amelia&subjects=bible,literacy,math&days=0,1,2,3&overview=1&checklists=1&key=1')
  await expect(page.locator('[data-ws-page]').first()).toBeVisible()
  const report = await page.evaluate(() => {
    const pages = [...document.querySelectorAll<HTMLElement>('[data-ws-page]')]
    return {
      count: pages.length,
      names: pages.map((p) => p.querySelector('header')?.textContent ?? ''),
      clipped: pages.filter((p) => {
        const c = p.querySelector<HTMLElement>('[data-ws-content]')!
        return c.scrollHeight > c.clientHeight + 2 || c.scrollWidth > c.clientWidth + 2
      }).map((p) => p.dataset.wsPage),
      missing: document.querySelectorAll('[data-missing-picture]').length,
    }
  })
  // Pre-K 5 + K 8 + 1st 8 per child; two Pre-K copies
  expect(report.count).toBe(5 + 5 + 8 + 8)
  expect(report.names.filter((n) => n.includes('Seraiah')).length).toBe(5)
  expect(report.names.filter((n) => n.includes('Amelia')).length).toBe(5)
  expect(report.clipped).toEqual([])
  expect(report.missing).toBe(0)
  await expect(page.getByText('Answer Key — Week 8')).toBeVisible()
  const pdf = await page.pdf({ format: 'Letter', printBackground: true })
  expect(pdf.byteLength).toBeGreaterThan(50_000)
})

test('kid view: big tasks, star progress, and a grown-up gate', async ({ page }) => {
  await fresh(page)
  await page.goto('/kid/c-olori')
  await expect(page.getByText('Hi Olori-Joy!')).toBeVisible()
  await page.getByRole('button', { name: /I did it!/ }).first().click()
  await expect(page.getByLabel(/1 of \d done/)).toBeVisible()
  await page.getByRole('button', { name: /Letter sounds/ }).click()
  await expect(page.getByRole('button', { name: 'Letter name' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Letter sound' })).toBeVisible()
  await page.getByRole('button', { name: 'Back' }).click()
  await page.getByRole('button', { name: /Grown-ups only/ }).click()
  await page.getByLabel('Answer').fill('0')
  await page.getByRole('button', { name: 'Leave', exact: true }).click()
  await expect(page.getByText('Not quite.')).toBeVisible()
})

test('every main page loads without errors and retired URLs redirect', async ({ page }) => {
  const errors = trackErrors(page)
  await fresh(page)
  for (const path of ['/week', '/curriculum', '/students', '/print', '/progress', '/library', '/library/family', '/settings', '/restart']) {
    await page.goto(path)
    await expect(page.locator('h1').first()).toBeVisible()
  }
  for (const [from, to] of [['/today', '/'], ['/printables', '/print'], ['/children', '/students'], ['/planner', '/week']]) {
    await page.goto(from)
    await expect(page).toHaveURL(new RegExp(`${to === '/' ? 'localhost:3100/$' : to}`))
  }
  expect(errors).toEqual([])
})

test('@mobile Today and Print fit a phone screen without sideways scrolling', async ({ page }) => {
  await fresh(page)
  for (const path of ['/', '/week', '/print', '/progress']) {
    await page.goto(path)
    await expect(page.locator('h1').first()).toBeVisible()
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow, path).toBeLessThanOrEqual(1)
  }
  await expect(page.getByRole('navigation', { name: 'Quick' })).toBeVisible()
})

test('whole year: no worksheet page is clipped or missing a picture (36 weeks × 4 learners)', async ({ page }) => {
  test.setTimeout(300_000)
  await fresh(page)
  const problems: string[] = []
  for (let week = 1; week <= 36; week++) {
    await page.goto(`/print/packet?week=${week}&children=c-alijah,c-olori,c-seraiah,c-amelia&subjects=bible,literacy,math&days=0,1,2,3&overview=0&checklists=0&key=0`)
    await expect(page.locator('[data-ws-page]').first()).toBeVisible()
    const r = await page.evaluate(() => ({
      count: document.querySelectorAll('[data-ws-page]').length,
      clipped: [...document.querySelectorAll<HTMLElement>('[data-ws-page]')]
        .filter((p) => {
          const c = p.querySelector<HTMLElement>('[data-ws-content]')!
          return c.scrollHeight > c.clientHeight + 2 || c.scrollWidth > c.clientWidth + 2
        })
        .map((p) => p.dataset.wsPage),
      missing: [...document.querySelectorAll<HTMLElement>('[data-missing-picture]')].map((e) => e.dataset.missingPicture),
    }))
    if (r.count !== 26) problems.push(`week ${week}: ${r.count} pages`)
    r.clipped.forEach((id) => problems.push(`clipped ${id}`))
    r.missing.forEach((m) => problems.push(`week ${week}: missing picture ${m}`))
  }
  expect(problems).toEqual([])
})

test('Video day lists this week’s videos from the vetted channels', async ({ page }) => {
  await fresh(page)
  await page.getByRole('button', { name: 'I need an easy day' }).click()
  await page.getByRole('link', { name: /Videos for this week/ }).click()
  await expect(page.getByRole('heading', { name: /Video day — Week 8/ })).toBeVisible()
  const hrefs = await page.locator('#videos').locator('..').locator('a[href^="https://www.youtube.com"]').evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).href))
  expect(hrefs.some((h) => h.includes('@saddlebackkids/search?query=Noah'))).toBe(true)
  expect(hrefs.every((h) => /youtube\.com\/(@(saddlebackkids|jackhartmann|numberblocks)\/search|results\?search_query=(Suitcase|SciShow))/.test(h))).toBe(true)
})

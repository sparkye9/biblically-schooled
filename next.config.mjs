/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Pages retired in the redesign point to the screen that replaced them,
  // so old bookmarks keep working.
  async redirects() {
    const moved = [
      ['/today', '/'],
      ['/start-school', '/'],
      ['/shared', '/'],
      ['/planner', '/week'],
      ['/prep', '/week'],
      ['/sunday-prep', '/week'],
      ['/supplies', '/week'],
      ['/teaching-guide', '/curriculum'],
      ['/bible', '/curriculum'],
      ['/children', '/students'],
      ['/portfolio', '/progress'],
      ['/printables', '/print'],
      ['/print-center', '/print'],
      ['/lessons/:lesson', '/students'],
    ]
    return moved.map(([source, destination]) => ({ source, destination, permanent: false }))
  },
}

export default nextConfig

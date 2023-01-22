const container = document.querySelector('main section:nth-of-type(1)')
const containerBox = container.getBoundingClientRect()

const sky = document.querySelector('svg .sky')
const sun = document.querySelector('svg .sun')
const water = document.querySelector('svg .water')
const ground = document.querySelector('svg .ground')

window.addEventListener('scroll', () => {
  let clamped = clamp(0, containerBox.height, window.scrollY)
  let lerped = invlerp(0, containerBox.height, clamped)

  sky.setAttribute('transform', `translate(${lerped * 250}, 0)`)
  sky.setAttribute('transform', `scale(${1 - lerped})`)

  sun.setAttribute('transform', `rotate(${range(0, containerBox.height, 0, 30, clamped)}, 0, 400)`)
  water.setAttribute('transform', `translate(0, ${lerped * 468})`)
  ground.setAttribute('transform', `scale(${1 + lerped * 2})`)
})

/**
 * Yields a number clamped within a given spectrum. If you give it a number that
 * falls within the bounds of the minimum and maximum it will yield that number.
 * If not it will return either the minimum or the maximum. For example:
 *  clamp(50, 100, 20) yields 50 (because value < min)
 *  clamp(50, 100, 75) yields 75 (because min < value < max)
 *  clamp(50. 100. 120) yields 100 (because value > max)
 * @param {number} min the lower value of the spectrum
 * @param {number} max the higher value of the spectrum
 * @param {number} value the value to be clamped between min and max
 * @returns {number} the clamped value
 */
function clamp(min, max, value) {
  return Math.min(Math.max(min, value), max)
}

/**
 * Lerp is short for lineair interpolation and yields a number on a spectrum
 * using the specified percentage. It's great for answering questions like: What
 * number is 50% between 50 and 100? For example: lerp(50, 100, 0.5) yields 75
 * @param {number} min the lower value of the spectrum
 * @param {number} max the higher value of the spectrum
 * @param {number} percentage the percentage
 * @returns {number} the lineair interpolated number
 */
function lerp(min, max, percentage) {
  return min * (1 - percentage) + max * percentage
}

/**
 * Invlerp is short for inverse lineair interpolation and does the oposite of
 * the lerp function. Instead of passing a decimal midpoint, you pass any value
 * and it will return a percentage wherever it falls on that spectrum.
 * Internally it uses a clamp, so it will never yield a percentage below 0 or
 * above 1. It's great for answering questions like: How far through has a user
 * scrolled? For example: invlerp(50, 100, 75) yields 0.5
 * @param {number} min the lower value of the spectrum
 * @param {number} max the higher value of the spectrum
 * @param {number} value the number on the spectrum
 * @returns {number} the percentage of the value on the spectrum
 */
function invlerp(min, max, value) {
  return min !== max ? (value - min) / (max - min) : 0
}

/**
 * Converts a value from one spectrum to another. You pass two spectra and a
 * value representing a point on the first spectrum. The function will then
 * extrapolate this point to the same place on the second spectrum. It's great
 * for animating elements a certain amount when the actual scroll distance is a
 * lot larger. For example: range(10, 100, 2000, 20000, 50) yields 10000
 * @param {number} min1 the lower value of the first spectrum
 * @param {number} max1the higher value of the first spectrum
 * @param {number} min2 the lower value of the second spectrum
 * @param {number} max2 the higher value of the second spectrum
 * @param {number} value the number on the first spectrum
 * @returns {number} the value extrapolated to the second spectrum
 */
function range(min1, max1, min2, max2, value) {
  return lerp(min2, max2, invlerp(min1, max1, value))
}

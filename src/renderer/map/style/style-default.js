import { Stroke, Style } from 'ol/style'
import Circle from 'ol/style/Circle'
import Fill from 'ol/style/Fill'
import ColorSchemes from './color-schemes'


const identity = sidc => sidc ? sidc[1] : 'U' // identity or U - UNKNOWN
const status = sidc => sidc ? sidc[3] : 'P' // status or P - PRESENT
const strokeOutlineColor = sidc => identity(sidc) === '*' ? '#FFFFFF' : '#000000'
const lineDash = sidc => status(sidc) === 'A' ? [20, 10] : null

const strokeColor = (sidc, n) => {
  const colorScheme = ColorSchemes.medium
  if (n === 'ENY') return colorScheme.red
  switch (identity(sidc)) {
    case 'F': return colorScheme.blue
    case 'H': return colorScheme.red
    case 'N': return colorScheme.green
    case 'U': return colorScheme.yellow
    default: return 'black'
  }
}

const outlineStroke = sidc => new Stroke({
  color: strokeOutlineColor(sidc),
  lineDash: lineDash(sidc),
  width: 3.5
})

const stroke = (sidc, n) => new Stroke({
  color: strokeColor(sidc, n),
  lineDash: lineDash(sidc),
  width: 2
})

const markerLineDash = sidc => status(sidc) === 'A' ? [8, 4] : null

const markerStroke = sidc => new Stroke({
  color: strokeOutlineColor(sidc),
  lineDash: markerLineDash(sidc),
  width: 2
})

const marker = (sidc, n) => new Circle({
  radius: 6,
  fill: new Fill({ color: strokeColor(sidc, n) }),
  stroke: markerStroke(sidc)
})

export default (feature, resolution) => {
  const { sidc, n } = feature.getProperties()
  const styles = []
  styles.push(new Style({ stroke: outlineStroke(sidc) }))
  styles.push(new Style({ stroke: stroke(sidc, n) }))
  styles.push(new Style({ image: marker(sidc, n) }))
  return styles
}

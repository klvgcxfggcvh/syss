export function createNATOSymbol(classification: string, unitType?: string): string {
  const baseColor = getClassificationColor(classification)
  const symbol = getUnitSymbol(unitType || "infantry")

  return `
    <div class="nato-symbol-container" style="
      width: 32px; 
      height: 32px; 
      display: flex; 
      align-items: center; 
      justify-content: center;
      background: ${baseColor};
      border: 2px solid #000;
      border-radius: 4px;
      color: white;
      font-weight: bold;
      font-size: 12px;
    ">
      ${symbol}
    </div>
  `
}

function getClassificationColor(classification: string): string {
  switch (classification) {
    case "friendly":
      return "#0066cc"
    case "enemy":
      return "#cc0000"
    case "neutral":
      return "#00cc00"
    case "unknown":
      return "#ffcc00"
    default:
      return "#666666"
  }
}

function getUnitSymbol(unitType: string): string {
  switch (unitType) {
    case "infantry":
      return "🚶"
    case "armor":
      return "🚗"
    case "artillery":
      return "💥"
    case "aviation":
      return "🚁"
    case "logistics":
      return "📦"
    case "medical":
      return "⚕️"
    case "engineer":
      return "🔧"
    case "signal":
      return "📡"
    default:
      return "●"
  }
}

export const NATO_UNIT_TYPES = [
  "infantry",
  "armor",
  "artillery",
  "aviation",
  "logistics",
  "medical",
  "engineer",
  "signal",
] as const

export type NATOUnitType = (typeof NATO_UNIT_TYPES)[number]

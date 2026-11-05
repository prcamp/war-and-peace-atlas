/* Generated historical geometry is loaded once alongside the atlas data. */
let territoryData;

function territoryAt(horizon, campaign) {
 const snapshotKey = horizon >= 338 ? '1820'
  : horizon >= 168 ? '1812'
  : horizon >= 146 ? '1811'
  : horizon >= 107 ? '1809'
  : horizon >= 105 ? 'tilsit'
  : horizon >= 69 ? '1806'
  : '1805';
 const snapshot = territoryData.snapshots[snapshotKey];
 let occupation = territoryData.campaigns[campaign.after + 1];
 if (snapshotKey === 'tilsit') occupation = {earlier: territoryData.campaigns[104].held};
 if (campaign.id === 'after-austria') occupation = {earlier: territoryData.campaigns[62].held};
 return {snapshot, occupation};
}

function historicalMap(territory, project, showControl) {
 const {snapshot, occupation} = territory;
 const path = (id, style, name) => {
  if (id == null) return '';
  const rings = territoryData.geometries[id];
  const outline = rings.map(ring => 'M' + ring.map(([lon, lat]) => (
   project({lon, lat}).map(value => value.toFixed(1)).join(',')
  )).join('L') + 'Z').join('');
  const title = name ? '<title>' + esc(name) + '</title>' : '';
  return '<path class="' + style + '" fill-rule="evenodd" vector-effect="non-scaling-stroke" d="' + outline + '">' + title + '</path>';
 };
 const borders = snapshot.borders.map(([name, id]) => path(id, 'period-border', name)).join('');
 const fills = showControl
  ? path(snapshot.acquired, 'territory-acquired', 'French acquisitions since 1790')
   + path(occupation?.earlier, 'territory-earlier', 'Earlier French occupation')
   + path(snapshot.occupied, 'territory-occupied', 'French military occupation')
   + path(occupation?.held, 'territory-occupied', 'French campaign occupation')
  : '';
 return '<g class="territory-layer" aria-label="French territorial control">' + fills + '</g>'
  + '<g class="period-borders" aria-label="Historical borders, ' + esc(snapshot.label) + '">' + borders + '</g>';
}

function territoryLegend(snapshot) {
 return '<div class="territory-legend" aria-label="Historical map legend">'
  + '<strong>Borders · ' + esc(snapshot.label) + '</strong>'
  + (filters.campaignLayer === 'off' ? '' :
    '<span><i class="territory-acquired"></i>French acquisitions since 1790</span>'
    + '<span><i class="territory-occupied"></i>Military occupation</span>'
    + '<span><i class="territory-earlier"></i>Earlier occupation</span>')
  + '</div>';
}

function territorySources() {
 return '<p>Border and territorial data are adapted from '
  + '<a href="https://github.com/Seshat-Global-History-Databank/cliopatria/tree/5f433377139a6eeaeacbdc894b70f8805b72c8b5" target="_blank" rel="noopener noreferrer">Cliopatria, Seshat Global History Databank</a>'
  + ' (Chalstrey et al., <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>). '
  + 'The map uses simplified period snapshots, with sovereign borders reconstructed where the source combined them with occupation. '
  + 'Darker fill marks French acquisitions relative to the 1790 French border. Lighter fill shows mapped military occupation. '
  + 'Allies and client states retain separate borders. The early campaigns and the 1812 invasion reveal portions of the source occupation footprint at the chapter milestones. '
  + 'The edges are approximate and represent broad phases of the campaign. Pale fill records territory released during the mapped campaign. '
  + 'For an overview of acquisitions and occupation together, choose Europe on the map.</p>';
}

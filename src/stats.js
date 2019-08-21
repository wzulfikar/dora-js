import Stats from 'stats.js'

const statsAll = [
    new Stats(),
    new Stats(),
    new Stats(),
]

const panelLayout = [0, 2, 1]

statsAll.forEach((stats, i) => {
    const pos = ((statsAll.length - 1 - i) * 81) + 5

    stats.showPanel(panelLayout[i])
    stats.domElement.style.cssText = `position:absolute;top:1px;right:${pos}px;`;
    document.body.appendChild(stats.domElement);
})

// adjust datgui placement
window.addEventListener('load', () => {
    const datGuiPanel = document.querySelector('.dg.ac')
    datGuiPanel.style.top = '50px'
    datGuiPanel.style.right = '-10px'
})

const updateStats = () => {
    statsAll.forEach(stats => {
        stats.update()
    })
}

export default {
    update: updateStats,
}

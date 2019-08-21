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
const style = document.createElement('style')
style.innerHTML = `
    .dg.ac {
        top: 50px;
        right: -10px;
    }
`
document.body.appendChild(style)

const updateStats = () => {
    statsAll.forEach(stats => {
        stats.update()
    })
}

export default {
    update: updateStats,
}

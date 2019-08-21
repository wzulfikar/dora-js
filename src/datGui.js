import * as dat from 'dat.gui';

const gui = new dat.GUI();

window.pipelineControls = {}

const setChecked = (pipelineName) => {
    Object.keys(window.pipelineControls).forEach(pipeline => {
        if (pipeline !== pipelineName) {
            window.pipelineControls[pipeline] = false
        }
    })
}

export const initDatGui = (pipelineHandlers) => {
    Object.keys(pipelineHandlers).forEach((pipeline, i) => {
        if (i === 0) {
            window.pipelineControls[pipeline] = true
        } else {
            window.pipelineControls[pipeline] = false
        }
    })

    const togglePipelinesGui = gui.addFolder('Toggle pipeline')
    Object.keys(window.pipelineControls).forEach(pipelineName => {
        const isEnabled = window.pipelineControls[pipelineName]
        togglePipelinesGui.add(window.pipelineControls, pipelineName, isEnabled)
            .listen()
            .onFinishChange(isChecked => {
                if (isChecked) {
                    setChecked(pipelineName)
                }
            })
    })
    togglePipelinesGui.open()
}

export const useGui = () => gui

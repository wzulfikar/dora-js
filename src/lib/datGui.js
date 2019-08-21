import * as dat from 'dat.gui';

const gui = new dat.GUI();
const defaultParams = {}
let foldersAdded = {}

const togglePipelineFolderName = 'Toggle pipeline'
const pipelineControlsNs = 'datgui_main_pipelineControls'
window[pipelineControlsNs] = {}

const getPipelineNs = pipelineName => `datgui_pipeline_${pipelineName}`

const setChecked = (pipelineName) => {
    Object.keys(window[pipelineControlsNs]).forEach(pipeline => {
        if (pipeline !== pipelineName) {
            window[pipelineControlsNs][pipeline] = false
            foldersAdded[pipeline] && foldersAdded[pipeline].close()
        } else {
            foldersAdded[pipeline] && foldersAdded[pipeline].open()
        }
    })
}

const persistStates = function () {
    const namespaces = Object.keys(window).filter(k => k.startsWith('datgui'))
    namespaces.forEach(namespace => {
        localStorage.setItem(namespace, JSON.stringify(window[namespace]))
    })
}

const resetStates = function () {
    const namespaces = Object.keys(window).filter(k => k.startsWith('datgui_pipeline_'))
    namespaces.forEach(namespace => {
        Object.keys(defaultParams[namespace]).forEach(prop => {
            window[namespace][prop] = defaultParams[namespace][prop]
        })
        localStorage.setItem(namespace, JSON.stringify(window[namespace]))
    })

    // first item in pipeline control is active by default
    Object.keys(window[pipelineControlsNs]).forEach((pipelineName, i) => {
        if (i === 0 && foldersAdded[pipelineName]) {
            foldersAdded[pipelineName].open()
        }
        window[pipelineControlsNs][pipelineName] = i === 0
    })

    // open toggle pipeline folder
    foldersAdded[togglePipelineFolderName].open()

    // propagate gui updates
    for (let folder in foldersAdded) {
        for (let i in foldersAdded[folder].__controllers) {
            // const propName = foldersAdded[folder].__controllers[i].property
            // const defaultPropVal = defaultParams[folder][propName]
            foldersAdded[folder].__controllers[i].updateDisplay()
        }
    }
}

export const initDatGui = (pipelineHandlers) => {
    // load pipeline control from storage
    const pipelineControlSnapshot = JSON.parse(localStorage.getItem(pipelineControlsNs))
    Object.keys(pipelineHandlers).forEach((pipeline, i) => {
        if (pipelineControlSnapshot && pipelineControlSnapshot[pipeline] !== undefined) {
            window[pipelineControlsNs][pipeline] = pipelineControlSnapshot[pipeline]
            return
        }

        // only activate first pipeline
        window[pipelineControlsNs][pipeline] = i === 0
    })

    const config = {
        'Reset states': () => resetStates()
    }
    const configFolder = gui.addFolder('Config')
    configFolder.add(config, 'Reset states')

    const togglePipelineFolder = gui.addFolder(togglePipelineFolderName)
    foldersAdded[togglePipelineFolderName] = togglePipelineFolder

    Object.keys(window[pipelineControlsNs]).forEach(pipelineName => {
        const isEnabled = window[pipelineControlsNs][pipelineName]
        togglePipelineFolder.add(window[pipelineControlsNs], pipelineName, isEnabled)
            .listen()
            .onFinishChange(isChecked => {
                if (isChecked) {
                    setChecked(pipelineName)
                }
            })
    })
    togglePipelineFolder.open()

    // persist datgui states in local storage
    window.onblur = persistStates
    window.onbeforeunload = persistStates
}

export const useGuiFolder = (folderName, params) => {
    const pipelineNs = getPipelineNs(folderName)
    defaultParams[pipelineNs] = params

    const folder = gui.addFolder(folderName)
    window[pipelineNs] = JSON.parse(localStorage.getItem(pipelineNs)) || params

    // add folder reference to `foldersAdded` cache
    foldersAdded[folderName] = folder

    return {folder, guiObj: window[pipelineNs]}
}

export const useGuiObj = pipelineName => {
    return window[getPipelineNs(pipelineName)]
}

export const usePipelineControls = () => window[pipelineControlsNs]
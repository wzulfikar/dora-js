import * as dat from 'dat.gui';
import {Subject} from 'rxjs'

const gui = new dat.GUI();
const defaultParams = {}
let foldersAdded = {}
let datgui$ = null

const togglePipelineFolderName = 'Toggle pipeline'
const pipelineControlsNs = 'datgui_main_pipelineControls'
const mainConfigNs = 'datgui_main_config'
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
    console.log('datgui states persisted')
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
        window[pipelineControlsNs][pipelineName] = i === 0
        if (foldersAdded[pipelineName]) {
            const shouldOpenFolder = window[pipelineControlsNs][pipelineName]
            if (shouldOpenFolder) {
                foldersAdded[pipelineName].open()
            } else {
                foldersAdded[pipelineName].close()
            }
        }
    })

    // propagate gui updates
    for (let folder in foldersAdded) {
        for (let i in foldersAdded[folder].__controllers) {
            foldersAdded[folder].__controllers[i].updateDisplay()
        }
    }
}

const datguiConfig = (datgui$, mainConfigObj, pipelineControls) => {
    return  {
        $observable: datgui$,
        config: {
            ...mainConfigObj
        },
        pipelineControls
    }
}

export const DEFAULT_CANVAS_SIZE = '600x400'

export const types = {
    CANVAS_SIZE: 'CANVAS_SIZE'
}

export const getCanvasSize = () => window[mainConfigNs]['Canvas size'].split('x')

export const initDatGui = (pipelineHandlers) => {
    if (datgui$) {
        return datguiConfig(datgui$, window[mainConfigNs], window[pipelineControlsNs])
    }

    datgui$ = new Subject()

    // load pipeline control from storage
    const pipelineControlSnapshot = JSON.parse(localStorage.getItem(pipelineControlsNs))
    Object.keys(pipelineHandlers).forEach((pipelineName, i) => {
        if (pipelineControlSnapshot && pipelineControlSnapshot[pipelineName] !== undefined) {
            window[pipelineControlsNs][pipelineName] = pipelineControlSnapshot[pipelineName]
            return
        }

        // only activate first pipeline
        window[pipelineControlsNs][pipelineName] = i === 0
    })

    // initialie config
    let config = JSON.parse(localStorage.getItem(mainConfigNs)) || {
        'Canvas size': DEFAULT_CANVAS_SIZE,
    }
    window[mainConfigNs] = config

    // add function config
    config['Reset states'] = () => resetStates()

    const configFolder = gui.addFolder('Config')
    configFolder.add(config, 'Canvas size', [ '600x400', '600x500', '500x500' ])
        .listen()
        .onFinishChange(v => {
            datgui$.next({type: types.CANVAS_SIZE, payload: v.split('x')})
        })
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

    return datguiConfig(datgui$, window[mainConfigNs], window[pipelineControlsNs])
}

export const useGuiFolder = (folderName, params) => {
    const pipelineNs = getPipelineNs(folderName)
    defaultParams[pipelineNs] = params

    const folder = gui.addFolder(`Pipeline: ${folderName}`)

    // add folder reference to `foldersAdded` cache
    foldersAdded[folderName] = folder

    // load gui states
    const persistedStates = JSON.parse(localStorage.getItem(pipelineNs)) || {}
    const guiObj = Object.assign(params, persistedStates)
    window[pipelineNs] = guiObj

    guiObj.useRegionOption = () => {
        // add default params for 'region' option
        defaultParams[pipelineNs] = {
            "Show region": false,
            "Region style": "bracket",
            "Region color": "#000000",
            ...defaultParams[pipelineNs],
        }
        folder.add(guiObj, "Show region");
        folder.add(guiObj, "Region style", ["bracket", "full"]);
        folder.addColor(guiObj, "Region color");
    }

    return {folder, guiObj, isActive: window[pipelineControlsNs][folderName] === true}
}

export const useGuiObj = pipelineName => {
    return window[getPipelineNs(pipelineName)]
}

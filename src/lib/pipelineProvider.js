import stats from './stats.js'

const pipelineProvider = async (canvas, pipelineHandlers, pipelineControls) => {
    await Promise.all(Object.keys(pipelineHandlers).map(async pipelineName => {
        const createPayload = await pipelineHandlers[pipelineName].initPipeline(canvas)
        pipelineHandlers[pipelineName].createPayload = createPayload
    }))

    const processFrame = async (canvas, image) => {
        let pipelineHasRun = false
        Object.keys(pipelineControls).map(async pipelineName => {
            if (!pipelineControls[pipelineName] || !canvas || !image.height) {
                return
            }
            pipelineHasRun = true

            const { handler, createPayload } = pipelineHandlers[pipelineName]
            const payload = createPayload ? await createPayload(image) : undefined
            handler(canvas, image, payload)
        })

        if (!pipelineHasRun) {
            const ctx = canvas.getContext('2d')
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        }
        stats.update()

        window.requestAnimationFrame(() => {
            processFrame(canvas, image)
        });
    };
    return processFrame
}

export default pipelineProvider

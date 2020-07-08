class Timer{
    constructor(startButton, pauseButton, duration, callbacks){
        this.startButton = startButton
        this.pauseButton = pauseButton
        this.duration = duration
        if(callbacks){
            this.onStart = callbacks.onStart
            this.onTick = callbacks.onTick
            this.onComplete = callbacks.onComplete
            this.onPause = callbacks.onPause
        }
        this.startButton.addEventListener("click", this.start)
        this.pauseButton.addEventListener("click", this.pause)
    }

    start = () => {
        if(this.onStart){
            this.onStart(this.timeRemaining)
        }
        this.tick()
        this.interval = setInterval(this.tick,100)
    }

    pause = () => {
        if(this.onPause){
            this.onPause(this.timeRemaining)
        }
        clearInterval(this.interval)
    }

    tick = () => {
        if(this.timeRemaining <= 0){
            this.pause()
            if(this.onComplete){
                this.onComplete()
            }
        }
        else{
            this.timeRemaining = this.timeRemaining - 0.1
            if(this.onTick){
                this.onTick(this.timeRemaining)
            }
        }
    }

    get timeRemaining(){
        return parseFloat(this.duration.value)
    }

    set timeRemaining(time){
        this.duration.value = time.toFixed(2)
    }
}
const startButton = document.querySelector("#start")
const pauseButton = document.querySelector("#pause")
const duration = document.querySelector("#duration")
const circle = document.querySelector("circle")
const initialPerimeter = circle.getAttribute("r") * Math.PI * 2
let perimeter = initialPerimeter
circle.setAttribute("stroke-dasharray", initialPerimeter)
let timerDuration = 0
let timerDuration2 = 0
let myConstant = 0
let initial = true
timer = new Timer(startButton, pauseButton, duration,{
    onStart(totalDuration){
        circle.setAttribute("stroke", "green")
        if(initial){
            timerDuration = totalDuration
            timerDuration2 = totalDuration
            initial = false
        }
    },
    onTick(timeRemaining){
        circle.setAttribute("stroke-dashoffset", 
        (perimeter*timeRemaining/timerDuration)-perimeter-myConstant
        )
    },
    onComplete(){
        circle.setAttribute("stroke", "red")
        circle.setAttribute("stroke-dashoffset", 0)
        duration.value = "Done!"
        initial = true
        myConstant = 0
        perimeter = initialPerimeter
    },
    onPause(timeRemaining){
        myConstant = initialPerimeter*(1-(timeRemaining/timerDuration2))
        perimeter = perimeter*(timeRemaining/timerDuration)
        timerDuration = timeRemaining
    }
})
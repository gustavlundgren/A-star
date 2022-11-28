//skapa canvas 
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let CANVAS_WIDTH = canvas.width
let CANVAS_HEIGHT = canvas.height 

let done = false

//game class som håller kolla på allt som händer
class Game{
    constructor(){

    }

    update(){ 

    }

    draw(){

    }
}

//class för att skapa och rita ut en grid av valfri storlek
class Grid{
    constructor(start, end, cWidth, cHeight){
        this.cols = 50
        this.rows = 50
        this.grid = new Array(this.cols)
        this.openSet = []
        this.closedSet = [] 
        this.start = start
        this.end = end
        this.cellWidth = cWidth / this.cols
        this.cellHeight = cHeight / this.rows
        this.path = []
    }

    //skapar en grid i datorn minne med värden för alla celler och skapar en cell på varje position
    drawGrid(){
        for(let i = 0; i < this.cols; i++){
            this.grid[i] = new Array(this.rows)
        }

        for(let i = 0; i < this.cols; i++){
            for(let j = 0; j < this.rows; j++){
                this.grid[i][j] = new Cell(i, j, this.cellWidth, this.cellHeight, this.rows, this.cols)
            }
        }

        for(let i = 0; i < this.cols; i++){
            for(let j = 0; j < this.rows; j++){
                this.grid[i][j].addNeighbors(this.grid)
            }
        }
        
        //swith som gör om 1 och 0 till väden i 2d arreyen för enklare implementering av funktionen
        switch(this.start){
            case 1:
                this.start = this.grid[0][0]
                break

            default:
                console.log('err start');
                break
        }

        switch(this.end) {
            case 1:
                this.end = this.grid[this.cols - 25][this.rows - 25]
                break 

            default:
                console.log('err end');
                break
        }

        //första cellen läggs till i listan över celler som vilideras. Efterssom det till en början bara finns den så måste den valideras först
        this.openSet.push(this.start)
        
        //loopar igen och ger grannar till alla celler och ritar även ut allt på canvasen för att man ska kunna se hur aloritmen jobbar
        for(let i = 0; i < this.cols; i++){
            for(let j = 0; j < this.rows; j++){
                this.grid[i][j].show()
            }
        }
    }

    update(){
        // end cellen altså målet för algoritmen blir blå. Detta är för att förenkla visualisering av algoritmmens arbete
        this.end.show('blue')

        //Vad som ska hända om det finns data i openSet, vilket det gör tills algoritmen är klar
        if(this.openSet.length > 0){
            //skapar variabel för den bästa cellen
            this.winner = 0

            //kollar vilken cell i openSet som har det bästa f värdet
            for(let i = 0; i < this.openSet.length; i++){
                if(this.openSet[i].f < this.openSet[this.winner].f){
                    this.winner = i
                }
            }

            //sätter den nuvarande cellen för att validera till den cellen som har bäst f värde
            this.current = this.openSet[this.winner]

            //om den nuvarande cellen är den cellen som algoritmen hade som mål att nå så är algoritmen klar och kommer logga "Done!!"
            if(this.current === this.end){

                //hitta vägen 
                this.temp = this.current

                this.path.push(this.temp)

                while(this.temp.previous){
                    this.path.push(this.temp.previous)
                    this.temp = this.temp.previous
                }

                console.log("Done!!");
                done = true
            }

            //kör min funktion för att ta bort den nuvarande cellen från openSet efter att den har blivit validerad
            removeFromArrey(this.openSet, this.current)

            //lägegr till den validerade cellen i closedSet efterssom den inte behövs mer
            //ta bort if sats när det funkar, ska inte kunna chacka nuvarande igen så den ska inte behövas
            if(!this.closedSet.includes(this.current)){
               this.closedSet.push(this.current) 
            }
        }  

        //variabel för att hålla nuvarande cells grannar
        this.neighbors = this.current.neighbors

        for(let i = 0; i < this.neighbors.length; i++){
            this.neighbor = this.neighbors[i]

            if(!this.closedSet.includes(this.neighbor)){
                this.tempG = this.current.g + 1

                if(this.openSet.includes(this.neighbor)){
                    if(this.tempG < this.neighbor.g){
                    this.neighbor.g = this.tempG
                    }
                }else{
                    this.neighbor.g = this.tempG
                    this.openSet.push(this.neighbor)
                    console.log('granne');
                } 
                
                this.neighbor.h = heuristic(this.neighbor, this.end)
                this.neighbor.f = this.neighbor.g + this.neighbor.h
                this.neighbor.previous = this.current
            }
        }

        //visualisering
        //gör så att alla färdigvaliderade celler blir röda och de som hålelr på att bli validerade blir gröna
        for(let i = 0; i < this.closedSet.length; i++){
            this.closedSet[i].show('red')
        }

        for(let i = 0; i < this.openSet.length; i++){
            this.openSet[i].show('green')
        } 

        for(let i = 0; i < this.path.length; i++){
            this.path[i].show('blue')
        }
    }
}

//en klass för hur en cell i griden ska se ut och bete sig
class Cell{
    constructor(i, j, width, height, rows, cols){
        this.x = i
        this.y = j
        this.width = width
        this.height = height
        this.f = 0
        this.g = 0
        this.h = 0
        this.neighbors = []
        this.rows = rows
        this.cols = cols
        this.previous = undefined
    }

    //design på celler, col är vilken fyllnadsfärg som ska användas och det beror på vilken lista cellen ligger i
    show(col = 'white'){
        ctx.fillStyle = col
        ctx.fillRect(this.x * this.width, this.y * this.height, this.width, this.height)
        
        ctx.strokeStyle = 'black' 
        ctx.strokeRect(this.x * this.width, this.y * this.height, this.width, this.height) 
    }

    //tar reda på vilka celler som är grannar till den nuvarande cellen och lägger in det i datan för cellen
    addNeighbors(grid){
        if(this.x < this.cols - 1){
           this.neighbors.push(grid[this.x + 1][ this.y]) 
        }
        if(this.x > 0){
           this.neighbors.push(grid[this.x - 1][ this.y]) 
        }
        if(this.y < this.rows - 1){
            this.neighbors.push(grid[this.x][this.y + 1])
        }
        if(this.y > 0){
            this.neighbors.push(grid[this.x][this.y - 1])
        }
    }
}


//skapar en grid och ritar ut den
const grid = new Grid(1, 1, CANVAS_WIDTH, CANVAS_HEIGHT)
grid.drawGrid()


function loop(){
    if(!done){
       grid.update() 
    }
    
    requestAnimationFrame(loop)
}

loop()

//funktion som tar emot en lista och ett element för att sendan ta bort det elementet från listan. Den loopar igenom baklänges för att det inte ska bli problem med skipping när index ändras
function removeFromArrey(arr, elt){
    for(let i = arr.length - 1; i >= 0; i--){
        if(arr[i] == elt){
            arr.splice(i, 1)
        }
    }
}

function dist(x1, y1, x2, y2){
    let dx = Math.abs(x1 - x2)
    let dy = Math.abs(y1 - y2)

    let d = Math.sqrt((dx*dx)+(dy*dy))

    return d
}

function heuristic(a, b){
    let d = dist(a.x, a.y, b.x, b.y)
    return d
}
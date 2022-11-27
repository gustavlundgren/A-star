const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let CANVAS_WIDTH = canvas.width
let CANVAS_HEIGHT = canvas.height

class Game{
    constructor(){

    }

    update(){

    }

    draw(){

    }
}

class Grid{
    constructor(start, end, cWidth, cHeight){
        this.cols = 5
        this.rows = 5
        this.grid = new Array(this.cols)
        this.openSet = []
        this.closedSet = []
        this.start = start
        this.end = end
        this.cellWidth = cWidth / this.cols
        this.cellHeight = cHeight / this.rows
    }

    drawGrid(){
        for(let i = 0; i < this.cols; i++){
            this.grid[i] = new Array(this.rows)
        }

        for(let i = 0; i < this.cols; i++){
            for(let j = 0; j < this.rows; j++){
                this.grid[i][j] = new Cell(i, j, this.cellWidth, this.cellHeight)
            }
        }

        console.log(this.grid);
    }

    update(){
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
                this.end = this.grid[this.cols - 1][this.rows - 1]
                break 

            default:
                console.log('err end');
                break
        }

        this.openSet.push(this.start)

        while(this.openSet.length > 10){

        }

        for(let i = 0; i < this.cols.length; i++){
            for(let j = 0; j < this.rows; j++){
                this.grid[i][j].show('white')
            }
        }

        for(let i = 0; i < this.closedSet.length; i++){
            this.closedSet[i].show('red')
        }

        for(let i = 0; i < this.openSet; i++){
            this.openSet[i].show('green')
        } 
    }
}

class Cell{
    constructor(i, j, width, height){
        this.x = i
        this.y = j
        this.width = width
        this.height = height
        this.f = 0
        this.g = 0
        this.h = 0
    }

    show(col){
        ctx.fillStyle = col
        ctx.fillRect(this.x * this.width, this.y * this.height, this.width, this.height)
    }
}

const grid = new Grid(1, 1, CANVAS_WIDTH, CANVAS_HEIGHT)
grid.drawGrid()
grid.update()

function main(){

    requestAnimationFrame(main)
}

main()
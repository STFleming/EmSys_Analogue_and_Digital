// Class for a waveform
//
// At every timestep computes the current value and draws it

class wave { 

        constructor(svg, colour, x, y, height, width, func, name, adaptive=true, maxVal=20, minVal=-20) {

                // hard coded parameter
                this.timestep = 0.04;
                this.x_inc = 1; // the amount we increment the x-axis
                this.size = 128;

                this.svg = svg;
                this.colour = colour;
                this.x = x;
                this.y = y;
                this.height = height;
                this.width = width;
                this.name = name;
                this.adaptive = adaptive;
                this.maxVal = maxVal;
                this.minVal = minVal;

                // func -- a function that accepts t (time) and returns a value
                this.func = [];
                this.func.push(func);
                this.time = 0.0;

                // linear scale for the x-axis
                this.xscale = d3.scaleLinear().domain([0, this.size]).range([0, this.width]); 

                // ring buffer
                this.data = new Array(this.size); // stores the data for the path   
                this.offset = 0;
                // initialise to 0
                for(var i=0; i<this.size; i++) {
                        this.data[i] = 0.0;
                }
                console.log("Waveform size = " + this.size);
        }

        // pushes a value into the ring buffer
        push(val) {
                this.data[this.offset++] = val;
                this.offset %= this.data.length;
        }

        // computes the step (apply all queued funcs)
        compute(time){
                var tval = 0.0;
                for(var i=0; i<this.func.length; i++) {
                       tval += this.func[i](time); 
                }
                return tval;
        }

        // step() -- computes the next element, shifts everything along by one, then redraws
        step() {
                // increase time
                this.time += this.timestep;
                this.push(this.compute(this.time));        

                // draw
                this.draw();
        }

        // ---------- min max -------------
        // for efficiency I should really be tracking this as I am adding stuff.....
        // but I am very lazy atm! If a student is reading this, improve my code for extra credit.
        // returns the maximum value currently in the circular buffer
        max() {
                var max = -99999999.0;
                for(var j=0; j<this.size; j++) {
                        if(this.data[j] > max)
                                max = this.data[j];
                }
                return max;
        }

        // returns the minimum value currently in the circular buffer
        min() {
                var min = 99999999.0;
                for(var j=0; j<this.size; j++) {
                        if(this.data[j] < min)
                                min = this.data[j];
                }
                return min;
        }
        // -----------------------------------

        // Appends a function
        appendFunc(foo) {
                for(var i=0; i<foo.length; i++) {
                    this.func.push(foo[i]);
                }
        }

        // updates the function
        updateFunc(foo) {
                this.clearFunc();
                this.func.push(foo);
        }

        // returns the current function from this wave
        getFunc() {
                return this.func;
        }

        // clears the waveform function
        clearFunc() {
                this.func = [ ];
        }

        // clears the display 
        clear() {
                d3.selectAll("#"+this.name+"_lines").remove();
        }

        reset() {
                this.clear();
                for(var i=0; i<this.size; i++) {
                        this.data[i] = 0.0;
                }

                // clear all the functions
                this.func = [];

                this.offset = 0;
        }

        // draws the function 
        draw() {
              this.clear();

              var cmin=this.minVal;
              var cmax=this.maxVal;
              if(this.adaptive) {
                  // adaptive height
                  cmax = this.max();
                  cmin = this.min();
              } 
              var lin_scale = d3.scaleLinear().domain([cmin, cmax]).range([0, this.height]); 

              for(var i=0; i<this.size-1; i++) {
                 var idx = (i + this.offset) % this.data.length;
                 var idx_plus_1 = ((i+1) + this.offset) % this.data.length;

                 // draw a line between this point and the next point 
                 this.svg.append("line")
                         .attr("id", this.name + "_lines")  
                         .style("stroke", this.colour.base)
                         .style("stroke-width", 1)
                         .attr("x1", this.x + this.xscale(i))
                         .attr("y1", this.y + lin_scale(this.data[idx]))
                         .attr("x2", this.x + this.xscale(i+1))
                         .attr("y2", this.y + lin_scale(this.data[idx_plus_1]));

              }
        }
        

}

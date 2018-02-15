/*
 Copyright (c) 2016, BrightPoint Consulting, Inc.

 This source code is covered under the following license: http://vizuly.io/license/

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
 OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// @version 1.1.55

//**Getting runing with Vizly is as simple** as including
// <code>d3.js.min</code> and <code>vizuly.js.min</code> in your html and the following line in your javascript:
//
// <code>vizuly.viz.bar(myElement).data(myData).update();</code>
//
// Thats it.
//
// But, for a slightly more in-depth look, I recommend getting familiar with the example files included for each of the packages you purchased.
// These example files were designed to validate the features and functionality of each component. They also serve as
// introduction to vizuly component programming. For this tutorial we will use the bar chart component and be referencing.
// the <code>BarChart.html</code> and <code>BarChart.js</code> file.

// Locate the <code>**bar/BarTest.html**</code> and <code>**bar/bar_test.js**</code> files in the root directory of the software download.
// Open this file with your browser, Chrome is recommended.  If you are not running a local web server you may
// need to set a browser flag to allow local file access (to load the sample data.)   Here are some helpful tips
// for using local file access with chrome for
// <a href='http://blog.derraab.com/2013/05/30/start-google-chrome-with-local-file-access-on-mac-os-x/'>Mac</a>
// and <a href='http://chrisbitting.com/2014/03/04/allow-local-file-access-in-chrome-windows/'>Windows</a>
//
// Validate that the test file works and you can toggle through the various layout and property options.
//
// **Our first look**
//
// Take a look at the <code>BarChart.html</code> file and you will notice several debug source scripts that have been
// commented out, as well as the <code>vizuly_core.min.js</code> and <code>vizuly_bar.min.js</code> scripts.   If you want to
// debug the specific components of vizuly, simply comment out the <code>min.js</code> files and uncomment the debug files.
// You will now be able to step through all of the source code. The materialize and jQuery libraries are for the test container only
// and vizuly does not rely upon them.
//
// The easiest way to understand vizuly is to walk through the test container code and see how the bar chart is
// implemented. So lets take a look at just a 100 lines of code or so and see how things work.

// **Starting off**, we do a little bit of house cleaning and set up the test container page with some global variables.
// Once that is done we load the data via D3 and call our initialize routine.
var viz, viz_container, viz_title, data, theme, screenWidth;

const loadData = () => {
    //Here we grab our data via the <code>d3.json</code> utility.
    d3.json("https://api.jsonbin.io/b/5a7dfa4b2cc12d126d71cd84", function (json) {
        data = json;
        initialize();
    });
};

var svg = d3.select("svg");
svg.append("text")      // text label for the x axis
    .attr("x", 265 )
    .attr("y",  240 )
    .style("text-anchor", "middle")
    .text("Date");

//** Creating your first bar chart **

//Vizuly follows an almost identical function chaining syntax as that of D3.  If you know D3, vizuly will feel familiar to you,
// and if you are new to D3, programming vizuly will be a good introduction.
//
//In this routine we create our bar chart, set various properties, create a title and
//update the display.
//
const initialize = () => {

    //Here we set our <code>viz</code> variable by instantiating the <code>vizuly.viz.bar</code> function.
    //All vizuly components require a parent DOM element at initialization so they know where to inject their display elements.
    viz = vizuly.viz.column(document.getElementById("viz_container"));

    //Using the function chain syntax we can now set various properties of the bar chart.
    //
    //Both the <code>x</code> and <code>y</code> properties are used to map the data values
    //to the corresponding x and y axis within the chart.

    
    
    viz.data(data)
        .width(screenWidth).height(500)     //initial component display size
        .y(function (d, i)
            { return d.count; })    //property for x axis plot
        .x(function (d, i)
            { return d.effective_rate.toString(); })          //property for y axis plot
        .padding(0.15)                       //spacing between bars
        .on("update", onUpdate)              //fires every time viz is updated
        .on("zoom", zoom)                    //handles zoom event
        .on("mouseover", onMouseOver)        //handles mouse over event
        .on("mouseout", onMouseOut)          //handles mouse out event
        .on("measure", onMeasure);          //handles measure event

    //** Themes and skins **  play a big role in vizuly, and are designed to make it easy to make subtle or drastic changes
    //to the look and feel of any component.   Here we choose a theme and skin to use for our bar chart.
    // *See this <a href=''>guide</a> for understanding the details of themes and skins.*


    theme = vizuly.theme.column_bar(viz)
        .skin(vizuly.skin.COLUMNBAR_MATERIALBLUE);


    //T he <code>viz.selection()</code> property refers to the parent
    // container that was used at the object construction.  With this <code>selection</code> property we can use D3
    // add, remove, or manipulate elements within the component.  In this case we add a title label to our chart.
    viz_title = viz.selection()
        .select("svg")
        .append("text")
        .attr("class", "title")
        .attr("x", viz.width() / 2)
        .attr("y", 40).attr("text-anchor", "middle")
        .style("fill", "#FFF")
        .style("font-weight",300)
        .text("Company Name vs Others");

    var x_label = viz.selection()
        .select("svg")
        .append("text")
        .attr("class", "title")
        .attr("x", viz.width() / 2)
        .attr("y", viz.height()-3).attr("text-anchor", "middle")
        .style("fill", "#FFF")
        .style("font-weight",200)
        .style({"font-size":"15px"})
        .text("EFFECTIVE RATE");

    var y_label = viz.selection()
        .select("svg")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("class", "title")
        .attr("y", 4)
        .attr("x", (viz.height()/1.7)*-1)
        .attr("dy", "1em")
        .style("fill", "#FFF")
        .style("font-weight",200)
        .style({"font-size":"15px"})
        .text("NUMBER OF COMPANIES")
        ;

    //The <code>viz.update()</code> function tells the component to render itself to the display.
    //Any property changes that have occurred since the last update (including changes to the data) will now be rendered.
    viz.update();

    /*
    //This code is for the purposes of the demo and simply cycles through the various skins
    //The user can stop this by clicking anywhere on the page.
    var reel = vizuly.showreel(theme,['MaterialPink','MaterialBlue'],2000).start();
    var stopReel = function () {
        //Stop show reel
        reel.stop();
        //Remove event listeners
        d3.select("body").on("mousedown.reel",null);
        d3.select("body").on("wheel.reel",null);
    }

    // We need a two event listeners to stop the reel (because of the zoom operation)
    d3.select("body").on("mousedown.reel",stopReel);
    d3.select("body").on("wheel.reel",stopReel);
    */

};

//That's really all there is to getting up and running with vizuly.  Below you will find some additional functionality that may find
//helpful as well.

//** Making your own datatip **

// Data tips can be simple roll-overs that show a single value, or complex visualizations in themselves; showing charts and other data
// when the user clicks or moves the mouse over certain visualization display elements .
// Because there is no one size fits all, vizuly provides the hooks for you to create and manage data tips any way you see fit.
// Below is just one example of how you can do that.



//First we want to capture the <code>mouseover</code> event from the <code>viz</code> object so we know when to display the datatip.
//At the same time we will pass along some event parameters to the data tip so we know where to position it, and what values to show.
//When vizuly components emit a interaction event, they pass the DOM element, associated datum, and the datum index as seen here.
const onMouseOver = (bar, d, i) => {

    var rect = bar.getBoundingClientRect();
    var x = rect.left + d3.select(bar).attr("width") / 2;
    var y = rect.top; /* May need to fix height bug of tool tip */

    setDataTip("myDataTip", d, i, x, y);
}

//For this example we are going to use a simple HTML template for the datatip.  You can also use more complex and dynamic DOM elements declared
//dynamically via javascript or statically within your HTML.
const datatipHtml =
    `<div style='text-align:left;'>
   <b> Count &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</b>
   <span class='datatip-label'>
   </span>
   <br/>
   <b> Effective &nbsp;</b>
   <span class='datatip-value'></span>
   <br/>
   <b> rate </b>
 </div>`;


//Here is the function that creates and updates the display position and values for the datatip.
const setDataTip = (name, datum, index, x, y) => {

    //First we look to see if the datatip already exists based on the name parameter.
    let tip = d3.selectAll("#" + name);

    //If the datatip does not exist we then create it here and insert the HTML template defined above.
    if (tip[0].length < 1) {
        tip = d3.select("body").append("div").attr("id", name).style("position", "absolute").style("z-index", 99999);
        tip.html(datatipHtml);
    }

    //Here we update various styles and display measurements of the <code>viz</code> component.
    tip.attr("class", theme.skin().datatip_class)
        .style("width", (Math.max(75, viz.width() / 8) + "px"))
        .style("font-size", function () {
            return Math.max(9, Math.round(viz.width() / 70)) + "px";
        });

    //***This is where we set the number of olympic medals in the <code>'.datatip-value' span</code>.
    tip.selectAll(".datatip-value")
        .style("font-weight", function (d, i) {
            return (index == i) ? 400 : 200;
        })
        .style("color", function (d, i) {
            return (index == i) ? theme.skin().color : 'white';
                    })
        .html(function (d, i) {
            return parseFloat(viz.data()[0][getSeriesIndex(datum)].effective_rate.toString());
        });

    //Now we show what type of medal (bronze, silver, gold) in the <code>'.datatip-label' span</code>.
    tip.selectAll(".datatip-label")
        .style("font-weight", function (d, i) {
            return (index == i) ? 400 : 200;
        })
        .style("color", function (d, i) {
            return (index == i) ? theme.skin().color : 'white';
        })
        .html(function (d, i) {
            return viz.data()[0][getSeriesIndex(datum)].count;
        });

    
    //We add a little logic to position the datatip at the right end of the bar element.
    x = x - tip[0][0].getBoundingClientRect().width / 2;
    y = y - tip[0][0].getBoundingClientRect().height;

    tip.style("left", x + "px").style("top", y + "px");
};

//Here is a quick utility function that tells us what type of medal we are displaying in the datatip
const getSeriesIndex = (val) => {
    return viz.xScale().domain().indexOf(viz.x().apply(this, [val]));
};

//All we need to do here is remove the datatip when the user moves the mouse away.
const onMouseOut = (bar, d, i) => {
    removeDataTip("myDataTip");
};

const removeDataTip = (name) => {
    d3.selectAll("#" + name).remove();
};

//Just a simple function to make sure our title is centered if the <code>viz</code> measurements have changed.
const onMeasure = () => {
    viz_title.attr("x", viz.width() / 2);
};

//Here are the test container functions that show you how set **various properties** of the <code>vizuly.viz.bar</code> component.
//
//We change the skin by passing in a new skin value, which is a string constant declared in the theme itself.
//For the bar chart we have these skins available:
//
//<code>vizuly.skin.COLUMNBAR_AXIIS</code><br>
//<code>vizuly.skin.COLUMNBAR_NEON</code><br>
//<code>vizuly.skin.COLUMNBAR_MATERIALBLUE</code><br>
//<code>vizuly.skin.COLUMNBAR_MATERIALPINK</code>

const changeSkin = (val) => {
    if (!val) return;
    theme.skin(val);
    viz.selection().selectAll(".vz-bar").attr("height", 0).attr("y", viz.height());
    changeZoom(1);
    viz.update();
};


//Here we do a little animation magic with D3 and set all the bars to a width of <code>0</code>, so when we
//reset the size of the <code>viz</code> and call <code>.udpate()</code>, the bars animate by growing to the appropriate width.
const changeSize = (val) => {
    var s = String(val).split(",");
    viz.selection().selectAll(".vz-bar").attr("width", 0).attr("x", 0);
    viz_container.transition().duration(300).style('width', s[0] + 'px').style('height', s[1] + 'px');
    viz.width(s[0]).height(s[1]).update();

};

//This changes the layout of the bar chart by updating the layout property which is a constant located in the
// <code>src/viz/_viz.js</code> namespace file.  These are the available values:
//
//<code>vizuly.viz.layout.CLUSTERED</code><br>
//<code>vizuly.viz.layout.STACKED</code><br>
//<code>vizuly.viz.layout.OVERLAP</code><br>
//<code>vizuly.viz.layout.STREAM</code><br>
function changeLayout(val) {
    viz.layout(val).update();
}



//When the user slides the zoom slider in the test container, this is the routine
//that updates the zoom scale within the bar chart.  The <code>zoom</code> property
//expects a <a href='https://github.com/mbostock/d3/wiki/Zoom-Behavior'><code>d3.behavior.zoom()</code></a> object.
function changeZoom(val) {
    viz.zoom(viz.zoom().scale(val));
    d3.select("#zoomLabel").text("Zoom " + val + "x");
}


//When the user uses the mouse wheel or pinch/zoom touch gesture on the bar chart directly, this function makes sure
//that the test container zoom slider stays updated.!!
function zoom() {
    d3.select("#zoomLabel").text(Math.round(viz.zoom().scale()*100)/100 + "x");
}

//When the component is updated, we want to update the title of the viz
function onUpdate() {
    viz_title.style("fill",theme.skin().labelColor)
}

//**Some other features** to be aware of, are the internal **events** that vizuly exposes to make
//programming easier.
//
// * The <code>.on('initialize')</code> event is executed one time when the object is first constructed and has set up all the static
// DOM display containers.
//
// * The <code>.on('measure')</code> event is executed prior to any <code>viz.update()</code> calls and determines the size of internal display objects.
// This gives the developer a chance to override any internal measurements.  Typically a developer may set special axis properties
// or override some scales prior to rendering.
//
// * The <code>.on('update')</code> event is executed immediately after the component has rendered or updated
// any of the dom display elements, primarily D3 svg objects.
//
// * Vizuly also publishes events any time a public **property changes**.   For instance, you may want to adjust the position of
//  a display element each time the width of the component has changed.  That would be done like so:
//
//  <code> viz.on('width_change',myFunction) </code>
//
//  This applies to all public properties of the component.   To see the public properties of all vizuly components look <a href='coming soon'>here</a>
//
//Vizuly also supports **dynamic margins** with the <code>.margin()</code> property as seen here:
//
//  <code> viz.margin({top:10,bottom:10,left:10,right:10})</code>
//
//  you can also use something like the following
//
//  <code> viz.margin({top:'10%',bottom:'10%',left:'10%',right:'10%'})</code>
//
//  or any combination of fixed and relative margins.
//
//

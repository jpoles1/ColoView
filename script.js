//Config Vars
var dtap_timeout = 300;
//Env Vars
var being_touched = 0;
var in_vr = 0;
var taped_twice = 0;
var old_pos = null;
var rot = [0, 0, 0];
var stepdir = 1;
//AFrame Components
AFRAME.registerComponent("listener", {
  schema : 
		{
			stepFactor : {
				type : "number",
				default : 0.05
			}
		},
		tick : function(){
      if(being_touched && in_vr){
        this.el.components.camera.camera.parent.position.add(this.el.components.camera.camera.getWorldDirection().multiplyScalar(stepdir*this.data.stepFactor));
		  }
    }
});
AFRAME.registerComponent('about_face', {
  init: function () {
    var el = this.el;
    el.addEventListener('about_face', function () {
      stepdir = stepdir*-1;
      return 1;
      var y = el.getAttribute('rotation').y;
      console.log(y)
      el.setAttribute('rotation', {y: y+180});
      //el.setAttribute('position', "0 3 5");
    });
  }
});

var startup = function(){
  document.addEventListener("touchstart", function(event){
    being_touched = 1;
    tapHandler();
  }, false);
  document.addEventListener("touchend", function(){
    being_touched = 0;
  }, false);
  document.querySelector('a-scene').addEventListener('enter-vr', function () {
    console.log("ENTERED VR");
    in_vr = 1;
  });
  document.querySelector('a-scene').addEventListener('exit-vr', function () {
    console.log("EXITED VR");
    in_vr = 0;
  });
  //window.addEventListener('deviceorientation', setOrientation, true);
  console.log("initialized.");
  var orig_pos = document.querySelector('#camera').getAttribute('position');
  function tapHandler() {
    if(!taped_twice) {
        taped_twice = 1;
        setTimeout( function() { taped_twice = 0; }, 300 );
        return false;
    }
    //action on double tap goes below
    if(in_vr){
      reset_camera();
    }
 }
  console.log(orig_pos)
  var reset_camera = function(){
    console.log("Resetting Camera")
    document.querySelector('#camera').emit("about_face")
    console.log(stepdir)
  }

}

var setOrientation = function(x){
  if(old_pos==null){
    old_pos = {alpha: x.alpha, beta: x.beta, gamma: x.gamma}
  }
  console.log(x.alpha, x.beta, x.gamma)
  if(being_touched){
    var slow_factor = 100
    rot[0] = rot[0] + (old_pos.alpha - x.alpha)/slow_factor
    rot[1] = rot[1] + (old_pos.beta - x.beta)/slow_factor
    rot[2] = rot[2] + (old_pos.gamma - x.gamma)/slow_factor
    console.log("rot:", rot)
    document.querySelector('#camera').setAttribute('orbit-controls', 'rotateTo', rot[0]+" "+rot[1]+" "+rot[2])
  }
  old_pos = {alpha: x.alpha, beta: x.beta, gamma: x.gamma}
}

function getQueryParams(qs) {
    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}

var gl;
var glcanvas;

function mat4Str(m) {
	var str = "";
	for (var i = 0; i < 16; i++) {
		var col = i%4;
		var row = (i-col)/4;
		if (row > 0 && col == 0) {
			str += "\n";
		}
		str += m[col*4+row].toFixed(2) + " ";
	}
	return str;
}

var LOOP_DITTY_CURVE = [[0, 0, 0, 1, 0], [0.172811, 0.0691244, 0, 2, 0], [0.403226, 0.241935, 0, 3, 0], [0.564516, 0.581797, 0, 4, 0], [0.679724, 1.05127, 0, 5, 0], [0.679724, 1.37817, 0, 6, 0], [0.564516, 1.61074, 0, 7, 0], [0.380184, 1.70399, 0, 8, 0], [0.264977, 1.56628, 0, 9, 0], [0.218894, 1.12849, 0, 10, 0], [0.288018, 0.805912, 0, 11, 0], [0.380184, 0.460289, 0, 12, 0], [0.587558, 0.137709, 0, 13, 0], [0.771889, 0.0225014, 0, 14, 0], [1.0023, 0.0916259, 0, 15, 0], [1.07143, 0.252916, 0, 16, 0], [1.11751, 0.552455, 0, 17, 0], [1.2788, 0.78287, 0, 18, 0], [1.46313, 0.828953, 0, 19, 0], [1.62442, 0.78287, 0, 20, 0], [1.73963, 0.483331, 0, 21, 0], [1.71659, 0.229875, 0, 22, 0], [1.53226, 0.137709, 0, 23, 0], [1.20968, 0.0916259, 0, 24, 0], [1.44009, 0.0685844, 0, 25, 0], [1.78571, 0.0455429, 0, 26, 0], [1.99309, 0.114667, 0, 27, 0], [2.17742, 0.322041, 0, 28, 0], [2.26959, 0.713746, 0, 29, 0], [2.43088, 0.805912, 0, 30, 0], [2.73041, 0.828953, 0, 31, 0], [2.93779, 0.690704, 0, 32, 0], [2.93779, 0.322041, 0, 33, 0], [2.82258, 0.0455429, 0, 34, 0], [2.36175, 0.114667, 0, 35, 0], [2.56912, -0.0235815, 0, 36, 0], [3.09908, -0.0353723, 0, 37, 0], [3.37558, 0.0508983, 0, 38, 0], [3.49078, 0.327396, 0, 39, 0], [3.51382, 0.649977, 0, 40, 0], [3.55991, 0.834308, 0, 41, 0], [3.7212, 0.880391, 0, 42, 0], [3.92857, 0.834308, 0, 43, 0], [4.06682, 0.719101, 0, 44, 0], [4.1129, 0.442603, 0, 45, 0], [4.08986, 0.23523, 0, 46, 0], [3.95161, 0.0969812, 0, 47, 0], [3.69816, 0.00481531, 0, 48, 0], [3.49078, -0.0412676, 0, 49, 0], [3.49078, -0.320713, 0, 50, 0], [3.47531, -0.489134, 0, 51, 0], [3.51756, -0.739214, 0, 52, 0], [3.51756, -1.04532, 0, 53, 0], [3.51756, -1.51522, 0, 54, 0], [3.5402, -1.29752, 0, 55, 0], [3.5402, -0.890136, 0, 56, 0], [3.5402, -0.595912, 0, 57, 0], [3.5402, -0.369586, 0, 58, 0], [3.69862, -0.211157, 0, 59, 0], [4.06075, -0.165892, 0, 60, 0], [4.26444, -0.165892, 0, 61, 0], [4.46813, -0.165892, 0, 62, 0], [4.67183, -0.165892, 0, 63, 0], [4.85289, -0.143259, 0, 64, 0], [5.10185, -0.143259, 0, 65, 0], [5.10185, 0.0604343, 0, 66, 0], [5.19238, 0.309393, 0, 67, 0], [5.23764, 0.558352, 0, 68, 0], [5.4866, 0.648883, 0, 69, 0], [5.6903, 0.694148, 0, 70, 0], [5.89399, 0.62625, 0, 71, 0], [6.05242, 0.377291, 0, 72, 0], [6.05242, 0.1057, 0, 73, 0], [6.02978, -0.0753615, 0, 74, 0], [5.75819, -0.143259, 0, 75, 0], [5.37344, -0.120627, 0, 76, 0], [5.89399, -0.143259, 0, 77, 0], [6.16558, -0.0979941, 0, 78, 0], [6.16558, 0.377291, 0, 79, 0], [6.16558, 0.762046, 0, 80, 0], [6.18821, 1.03364, 0, 81, 0], [6.21085, 1.46366, 0, 82, 0], [6.18821, 1.84841, 0, 83, 0], [6.27874, 1.5585, 0, 84, 0], [6.32401, 1.24164, 0, 85, 0], [6.27874, 0.76636, 0, 86, 0], [6.30138, 0.381605, 0, 87, 0], [6.30138, 0.0194828, 0, 88, 0], [6.4598, -0.161578, 0, 89, 0], [6.6635, -0.161578, 0, 90, 0], [6.77666, -0.0257825, 0, 91, 0], [6.82193, 0.33634, 0, 92, 0], [6.84456, 0.585299, 0, 93, 0], [6.86719, 0.811625, 0, 94, 0], [6.95772, 0.653196, 0, 95, 0], [6.95772, 0.358972, 0, 96, 0], [7.00299, 0.110013, 0, 97, 0], [7.04825, -0.0484151, 0, 98, 0], [7.18405, -0.184211, 0, 99, 0], [7.31984, -0.138946, 0, 100, 0], [7.45564, 0.0194828, 0, 101, 0], [7.50091, 0.404237, 0, 102, 0], [7.52354, 0.76636, 0, 103, 0], [7.52354, 1.15111, 0, 104, 0], [7.5688, 1.5585, 0, 105, 0], [7.5688, 1.98852, 0, 106, 0], [7.5688, 1.83225, 0, 107, 0], [7.54617, 1.3796, 0, 108, 0], [7.38774, 1.3796, 0, 109, 0], [7.04825, 1.3796, 0, 110, 0], [7.27458, 1.40223, 0, 111, 0], [7.5688, 1.3796, 0, 112, 0], [7.72723, 1.3796, 0, 113, 0], [7.97619, 1.3796, 0, 114, 0], [7.88566, 1.3796, 0, 115, 0], [7.68197, 1.40223, 0, 116, 0], [7.5688, 1.28907, 0, 117, 0], [7.59144, 1.06274, 0, 118, 0], [7.59144, 0.745884, 0, 119, 0], [7.59144, 0.361129, 0, 120, 0], [7.6367, 0.0442722, 0, 121, 0], [7.68197, -0.159421, 0, 122, 0], [7.81776, -0.249952, 0, 123, 0], [8.02146, -0.249952, 0, 124, 0], [8.20252, -0.249952, 0, 125, 0], [8.38358, -0.182054, 0, 126, 0], [8.47411, 0.0669049, 0, 127, 0], [8.51937, 0.315864, 0, 128, 0], [8.58727, 0.632721, 0, 129, 0], [8.6099, 1.01748, 0, 130, 0], [8.6099, 1.2438, 0, 131, 0], [8.6099, 1.53803, 0, 132, 0], [8.63254, 1.74172, 0, 133, 0], [8.65517, 2.01331, 0, 134, 0], [8.65517, 1.79938, 0, 135, 0], [8.65517, 1.57305, 0, 136, 0], [8.49674, 1.48252, 0, 137, 0], [8.24778, 1.45989, 0, 138, 0], [8.40621, 1.50516, 0, 139, 0], [8.6778, 1.45989, 0, 140, 0], [8.8815, 1.45989, 0, 141, 0], [9.10782, 1.43726, 0, 142, 0], [8.97203, 1.43726, 0, 143, 0], [8.72307, 1.48252, 0, 144, 0], [8.6778, 1.2562, 0, 145, 0], [8.70044, 0.961972, 0, 146, 0], [8.65517, 0.59985, 0, 147, 0], [8.6778, 0.282993, 0, 148, 0], [8.6778, 0.0340343, 0, 149, 0], [8.72307, -0.169659, 0, 150, 0], [8.8136, -0.237557, 0, 151, 0], [9.03992, -0.282823, 0, 152, 0], [9.13046, -0.0564962, 0, 153, 0], [9.15309, 0.305626, 0, 154, 0], [9.17572, 0.577218, 0, 155, 0], [9.26625, 0.667748, 0, 156, 0], [9.35678, 0.622483, 0, 157, 0], [9.37941, 0.237728, 0, 158, 0], [9.40205, 0.056667, 0, 159, 0], [9.42468, -0.237557, 0, 160, 0], [9.58311, -0.328088, 0, 161, 0], [9.89996, -0.328088, 0, 162, 0], [9.99539, -0.221002, 0, 163, 0], [10.106, 0.055496, 0, 164, 0], [10.106, 0.387293, 0, 165, 0], [10.1613, 0.691441, 0, 166, 0], [10.2442, 0.580842, 0, 167, 0], [10.2995, 0.110795, 0, 168, 0], [10.3272, -0.193352, 0, 169, 0], [10.3272, -0.580449, 0, 170, 0], [10.3272, -1.02285, 0, 171, 0], [10.2719, -1.27169, 0, 172, 0], [10.106, -1.52054, 0, 173, 0], [9.96774, -1.55085, 0, 174, 0], [9.80184, -1.59365, 0, 175, 0], [9.80184, -1.42151, 0, 176, 0], [9.91244, -1.17266, 0, 177, 0], [10.106, -1.03441, 0, 178, 0], [10.2719, -0.813213, 0, 179, 0], [10.5207, -0.702614, 0, 180, 0], [10.8249, -0.536715, 0, 181, 0], [11.129, -0.343167, 0, 182, 0]];

var LOADING_CURVE = [[0,0,0,1],[0.346052,0.123809,0,2],[0.771862,0.53719,0,3],[0.989135,1.31422,0,4],[1.09777,2.27308,0,5],[1.07061,3.26853,0,6],[0.85334,3.84774,0,7],[0.52743,3.94723,0,8],[0.473111,3.42663,0,9],[0.50027,2.77481,0,10],[0.608907,2.04151,0,11],[0.690385,1.33537,0,12],[0.771862,0.737872,0,13],[1.09777,0.276166,0,14],[1.39652,0.113211,0,15],[1.69527,0.14037,0,16],[1.77675,0.357643,0,17],[1.83107,0.79219,0,18],[2.18414,1.14526,0,19],[2.45573,1.03662,0,20],[2.64584,0.79219,0,21],[2.673,0.384803,0,22],[2.51005,0.249007,0,23],[2.0755,0.194688,0,24],[1.80391,0.221848,0,25],[2.18414,0.113211,0,26],[2.64584,0.276166,0,27],[3.05323,0.411962,0,28],[3.18903,0.79219,0,29],[3.32482,0.982304,0,30],[3.56926,1.00946,0,31],[3.86801,0.955145,0,32],[3.97664,0.79219,0,33],[4.0038,0.493439,0,34],[3.94948,0.276166,0,35],[3.51494,0.0317335,0,36],[3.10755,0.113211,0,37],[3.4063,0.113211,0,38],[3.89517,0.0860518,0,39],[3.94948,0.0860518,0,40],[4.03096,0.0317335,0,41],[4.16676,-0.0769031,0,42],[4.49267,-0.0610364,0,43],[4.68278,0.0476002,0,44],[4.7371,0.427828,0,45],[4.79142,0.916693,0,46],[5.17165,1.05249,0,47],[5.36176,0.971012,0,48],[5.57903,0.69942,0,49],[5.66051,0.536465,0,50],[5.52471,0.0747594,0,51],[4.92721,-0.00671808,0,52],[4.7371,-0.00671808,0,53],[5.60619,-0.0610364,0,54],[5.76915,0.0476002,0,55],[5.9321,0.37351,0,56],[5.98642,1.05249,0,57],[5.95926,1.92158,0,58],[6.01358,2.98079,0,59],[5.95926,3.49681,0,60],[5.82347,3.84988,0,61],[5.74199,3.38818,0,62],[5.85062,1.35124,0,63],[5.90494,0.590783,0,64],[5.98642,0.346351,0,65],[6.0679,0.183396,0,66],[6.25801,0.183396,0,67],[6.50244,0.292033,0,68],[6.69256,0.672261,0,69],[6.69256,0.916693,0,70],[6.74688,1.32408,0,71],[6.74688,1.32408,0,72],[6.77404,0.672261,0,73],[6.85551,0.346351,0,74],[6.90983,0.156237,0,75],[7.20858,0.156237,0,76],[7.3987,0.237714,0,77],[7.53449,0.617943,0,78],[7.64313,1.35124,0,79],[7.80608,1.35124,0,80],[8.07724,1.31612,0,81],[8.13199,1.29692,0,82],[8.26779,1.18828,0,83],[8.29495,0.943852,0,84],[8.29495,0.617943,0,85],[8.24063,0.210555,0,86],[8.43074,-0.0610364,0,87],[8.70234,0.0747594,0,88],[9.00109,0.590783,0,89],[9.16404,0.862375,0,90],[9.51711,1.18828,0,91],[9.68007,1.21544,0,92],[10.006,1.05249,0,93],[10.2232,0.563624,0,94],[10.3047,-0.0338772,0,95],[10.3047,-0.223991,0,96],[10.2776,0.109852,0,97],[10.1689,0.924627,0,98],[9.84302,1.03326,0,99],[9.54427,1.0061,0,100],[9.08256,0.625876,0,101],[8.94677,0.109852,0,102],[8.94677,-0.324695,0,103],[9.40847,-0.456524,0,104],[9.84302,-0.413802,0,105],[10.1418,-0.332324,0,106],[10.4405,-0.196528,0,107],[10.4405,-0.196528,0,108],[10.4677,-0.46812,0,109],[10.4405,-1.0171,0,110],[10.3862,-1.86193,0,111],[10.1146,-2.61026,0,112],[9.68007,-3.0659,0,113],[9.29984,-3.34804,0,114],[8.97393,-3.32615,0,115],[8.97393,-2.86445,0,116],[9.35416,-2.23979,0,117],[9.62575,-1.80524,0,118],[10.0331,-1.47933,0,119],[10.4677,-1.15342,0,120],[10.7936,-0.88183,0,121],[11.1195,-0.637398,0,122],[11.3368,-0.501602,0,123],[11.6084,-0.257169,0,124]];

var COLORMAP_JET = [0, 0, 0.5625, 0, 0, 0.625, 0, 0, 0.6875, 0, 0, 0.75, 0, 0, 0.8125, 0, 0, 0.875, 0, 0, 0.9375, 0, 0, 1, 0, 0.0625, 1, 0, 0.125, 1, 0, 0.1875, 1, 0, 0.25, 1, 0, 0.3125, 1, 0, 0.375, 1, 0, 0.4375, 1, 0, 0.5, 1, 0, 0.5625, 1, 0, 0.625, 1, 0, 0.6875, 1, 0, 0.75, 1, 0, 0.8125, 1, 0, 0.875, 1, 0, 0.9375, 1, 0, 1, 1, 0.0625, 1, 0.9375, 0.125, 1, 0.875, 0.1875, 1, 0.8125, 0.25, 1, 0.75, 0.3125, 1, 0.6875, 0.375, 1, 0.625, 0.4375, 1, 0.5625, 0.5, 1, 0.5, 0.5625, 1, 0.4375, 0.625, 1, 0.375, 0.6875, 1, 0.3125, 0.75, 1, 0.25, 0.8125, 1, 0.1875, 0.875, 1, 0.125, 0.9375, 1, 0.0625, 1, 1, 0, 1, 0.9375, 0, 1, 0.875, 0, 1, 0.8125, 0, 1, 0.75, 0, 1, 0.6875, 0, 1, 0.625, 0, 1, 0.5625, 0, 1, 0.5, 0, 1, 0.4375, 0, 1, 0.375, 0, 1, 0.3125, 0, 1, 0.25, 0, 1, 0.1875, 0, 1, 0.125, 0, 1, 0.0625, 0, 1, 0, 0, 0.9375, 0, 0, 0.875, 0, 0, 0.8125, 0, 0, 0.75, 0, 0, 0.6875, 0, 0, 0.625, 0, 0, 0.5625, 0, 0, 0.5, 0, 0];

var COLORMAP_DIMS_SAT  = [0,1,0,0,0,1,1,0,0,0,0.96552,1,1,0.22414,0.79311,1,0.79311,0.22414,0,0.55172,1,0,0.62068,0.051725,0.93103,0.15517,7.5e-06,0.36207,0,0.62068,1,0.89655,1,0.32758,1,0.43103,0.89655,0,1,0.28447,0.67242,0.82758,0.86207,1,0,1,0,0.41379,1,0.55556,0,0.25,0.035717,1,0.82758,0,0.51724,0.72414,0.62068,0,0.78571,1,0.64285,0.69998,0.39999,1,0.52381,1,0,1,0.43103,0.53449,0,0.25862,0.56896,0,0.68182,1,0.31035,0.46551,0.15517,0.98276,0,0.98276,0.56896,0.25862,0.41378,0,1,0.7619,1,0.82759,0,1,0.15,0,0,0,0.93103,0.41379,0,0,0.89654,0.58621,1,1,0.60871,0.28261,1,0,0.65517,0.79311,1,0.22414,0,0.2,1,0.93103,0.98276,0,0.52,0.94,1,1,0.775,0.92498,0.68965,0.27586,1,0,1,0.44828,0.98276,0,0,0.57692,0,1,0.25862,0,0.25862,1,1,0.68965,1,0.019224,0.42307,0.53449,1,0.74139,0,1,0.44999,0.51725,0.31035,0,0,0.62069,0.98276,0.48078,0.59615,1,0.5909,1,0.25,0,0.72414,0.5069,1,0.32499,0.62499,1,0,0.35];
var COLORMAP_DIMS_UNSAT = [0.21,0.7,0.21,0.21,0.21,0.7,0.7,0.21,0.21,0.21,0.6831,0.7,0.7,0.44655,0.63241,0.7,0.63241,0.44655,0.21,0.48034,0.7,0.086897,0.28966,0.10379,0.43448,0.26552,0.23172,0.20517,0.086897,0.28966,0.7,0.66621,0.7,0.48034,0.7,0.51414,0.64931,0.21,0.7,0.26793,0.35241,0.38621,0.63241,0.7,0.21,0.7,0.21,0.41276,0.65172,0.44897,0.19552,0.43931,0.37172,0.67586,0.38621,0.11586,0.28483,0.33793,0.30414,0.10138,0.45621,0.5069,0.42241,0.41517,0.34759,0.48276,0.33793,0.5069,0.15207,0.7,0.51414,0.54793,0.079655,0.16414,0.26552,0.32828,0.58172,0.7,0.18345,0.21724,0.14966,0.45862,0.15448,0.45862,0.26552,0.19793,0.23172,0.15207,0.5069,0.42241,0.7,0.61552,0.21,0.7,0.41276,0.36207,0.13034,0.13034,0.43448,0.1931,0.057931,0.057931,0.66621,0.56483,0.7,0.55517,0.45379,0.36931,0.7,0.21,0.53103,0.63241,0.7,0.44655,0.22931,0.28,0.48276,0.44172,0.45862,0.13759,0.46828,0.58655,0.60345,0.48276,0.43207,0.46586,0.59862,0.46345,0.7,0.21,0.7,0.42966,0.45862,0.13759,0.13759,0.44172,0.18828,0.62759,0.12069,0.036207,0.12069,0.7,0.7,0.59862,0.62759,0.34034,0.45862,0.54793,0.7,0.61552,0.14483,0.48276,0.2969,0.24138,0.17379,0.072414,0.13759,0.34034,0.45862,0.47552,0.50931,0.62759,0.42966,0.53103,0.34517,0.16897,0.33793,0.28724,0.48276,0.33069,0.39828,0.48276,0.14483,0.2631];

function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(.  Try a new version of chrome or firefox and make sure your newest graphics drivers are installed");
    }
}


//Type 0: Fragment shader, Type 1: Vertex Shader
function getShader(gl, str, type) {
    var xmlhhtp;
    var shader;
    if (type == 0) {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (type == 1) {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }
    
    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}


var shaderProgram;
var shaderProgram2;

function initShaders() {
    var str = "precision mediump float;\n";
    str = str + "varying vec4 fColor;\n";
    str = str + "void main(void) {\n";
    str = str + "gl_FragColor = fColor;\n";
    str = str + "}\n\n";
    var fragmentShader = getShader(gl, str, 0);
    var fragmentShader2 = getShader(gl, str, 0);

    var strFirst = "attribute vec3 vPos;\n";
    strFirst = strFirst + "attribute vec4 vColor;\n";
    strFirst = strFirst + "uniform mat4 uMVMatrix;\n";
    strFirst = strFirst + "uniform mat4 uPMatrix;\n";
    strFirst = strFirst + "varying vec4 fColor;\n";
    strFirst = strFirst + "void main(void) {\n";
    
    var strSecond = "gl_Position = uPMatrix * uMVMatrix * vec4(vPos, 1.0);\n";
    strSecond = strSecond+ "fColor = vColor;\n";
    strSecond = strSecond + "}";
    var vertexShader = getShader(gl, strFirst + "gl_PointSize = 3.0;\n" + strSecond, 1);
    var vertexShader2 = getShader(gl, strFirst + "gl_PointSize = 15.0;\n" + strSecond, 1);

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
    gl.useProgram(shaderProgram);
    shaderProgram.vPosAttrib = gl.getAttribLocation(shaderProgram, "vPos");
    gl.enableVertexAttribArray(shaderProgram.vPosAttrib);
    shaderProgram.vColorAttrib = gl.getAttribLocation(shaderProgram, "vColor");
    gl.enableVertexAttribArray(shaderProgram.vColorAttrib);
    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

    shaderProgram2 = gl.createProgram();
    gl.attachShader(shaderProgram2, vertexShader2);
    gl.attachShader(shaderProgram2, fragmentShader2);
    gl.linkProgram(shaderProgram2);
    if (!gl.getProgramParameter(shaderProgram2, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
    gl.useProgram(shaderProgram2);
    shaderProgram2.vPosAttrib = gl.getAttribLocation(shaderProgram2, "vPos");
    gl.enableVertexAttribArray(shaderProgram2.vPosAttrib);
    shaderProgram2.vColorAttrib = gl.getAttribLocation(shaderProgram2, "vColor");
    gl.enableVertexAttribArray(shaderProgram2.vColorAttrib);
    shaderProgram2.pMatrixUniform = gl.getUniformLocation(shaderProgram2, "uPMatrix");
    shaderProgram2.mvMatrixUniform = gl.getUniformLocation(shaderProgram2, "uMVMatrix");
}


var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();
var offset = vec3.create();

function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}


function setUniforms(sP) {
    gl.uniformMatrix4fv(sP.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(sP.mvMatrixUniform, false, mvMatrix);
    //gl.uniform1f(shaderProgram.pointSizeUniform, false, pointSize);
}


function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

//Mouse variables
var lastX;
var lastY;
var dragging = false;
var MOUSERATE = 0.005;
var clickType = "LEFT";
var justClicked = false;

getMousePos = function(evt) {
    return {
        X: evt.clientX,
        Y: evt.clientY
    };
}

releaseClick = function(evt) {
	evt.preventDefault();
	dragging = false;
	requestAnimFrame(repaint);
	return false;
} 

mouseOut = function(evt) {
	dragging = false;
	requestAnimFrame(repaint);
	return false;
}

makeClick = function(e) {
    var evt = (e == null ? event:e);
    clickType = "LEFT";
	evt.preventDefault();
	if (evt.which) {
	    if (evt.which == 3) clickType = "RIGHT";
	    if (evt.which == 2) clickType = "MIDDLE";
	}
	else if (evt.button) {
	    if (evt.button == 2) clickType = "RIGHT";
	    if (evt.button == 4) clickType = "MIDDLE";
	}
	dragging = true;
	justClicked = true;
	var mousePos = getMousePos(evt);
	lastX = mousePos.X;
	lastY = mousePos.Y;
	requestAnimFrame(repaint);
	return false;
} 

//http://www.w3schools.com/jsref/dom_obj_event.asp
clickerDragged = function(evt) {
	evt.preventDefault();
	var mousePos = getMousePos(evt);
	var dX = mousePos.X - lastX;
	var dY = mousePos.Y - lastY;
	lastX = mousePos.X;
	lastY = mousePos.Y;
	if (dragging) {
		//Translate/rotate shape
		if (clickType == "MIDDLE") {
			camera.translate(dX, -dY);
		}
		else if (clickType == "RIGHT") { //Right click
			camera.zoom(dY); //Want to zoom in as the mouse goes up
		}
		else if (clickType == "LEFT") {
			camera.orbitLeftRight(dX);
			camera.orbitUpDown(-dY);
		}
	    requestAnimFrame(repaint);
	}
	return false;
}	


//Playing information
var playIdx = 0;
var playTime = 0;
var startTime = 0;
var offsetTime = 0;
var playing = false;

//Delay Series Information
var DelaySeries = [ [] ];

//Centers Information
var centers = [];
var dims = [];
var edges = [];

//Vertex/color buffers for the entire point cloud
var allVertexVBO = -1;
var allColorVBO = -1;
var times = [];

//Make a separate vertex/color buffer for each center
var byCenterVertexVBO = [];
var byCenterColorVBO = [];
var centerCouts = [];

//Make a separate vertex buffer for the centers by themselves
var centerVertexVBO = -1;
var centerColorVBO = -1;
var edgesVertexVBO = -1;
var edgesColorVBO = -1;

//Camera stuff
var camera = new MousePolarCamera(800, 600, 0.75);
var farR = 1.0;

function initGLBuffers(X) {
    console.log("Initializing buffers...");
    var N = X.length;
    if (N <= 0) {
        return;
    }
    DelaySeries = X;
    playIdx = N-1;
    playTime = X[X.length-1][3];
    var i = 0;
    var k = 0;
    
    var vertices = [];
    var colors = [];
    times = [];
    var label;
    var dim;
    
    var centersV = [];
    var centersC = [];
    for (i = 0; i < centers.length; i++) {
        centersV.push([]);
        centersC.push([]);
    }
    
    for (i = 0; i < N; i++) {
        label = X[i][4];
        dim = dims[label]-1;
        for (k = 0; k < 3; k++) {
            vertices.push(X[i][k]);
            centersV[label].push(X[i][k]);
        }
        times.push(X[i][3]);
        //TODO: Add modular stuff for dimensions > 58?
        colors.push(COLORMAP_DIMS_UNSAT[dim*3]);//Red
        colors.push(COLORMAP_DIMS_UNSAT[dim*3+1]);//Green
        colors.push(COLORMAP_DIMS_UNSAT[dim*3+2]);//Blue
        colors.push(1);//Alpha
        centersC[label].push(COLORMAP_DIMS_SAT[dim*3]);//Red
        centersC[label].push(COLORMAP_DIMS_SAT[dim*3+1]);//Green
        centersC[label].push(COLORMAP_DIMS_SAT[dim*3+2]);//Blue
        centersC[label].push(1);//Alpha
    }
    
    //Initialize Vertex and color buffers for all points and for the 
    //different centers
    //Initialize vertex buffers
    centerCounts = [];
    if (allVertexVBO == -1) {
        allVertexVBO = gl.createBuffer();
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, allVertexVBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    allVertexVBO.itemSize = 3;
    allVertexVBO.numItems = N;
    //Reuse buffers from previous centers if they exist
    while (byCenterVertexVBO.length < centers.length) {
        byCenterVertexVBO.push(gl.createBuffer());
    }
    for (i = 0; i < centers.length; i++) {
        gl.bindBuffer(gl.ARRAY_BUFFER, byCenterVertexVBO[i]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(centersV[i]), gl.STATIC_DRAW);
        byCenterVertexVBO[i].itemSize = 3;
        byCenterVertexVBO[i].numItems = centersV[i].length/3;
        centerCounts.push(centersV[i].length/3);
    }
    
    //Initialize color buffers
    if (allColorVBO == -1) {
        allColorVBO = gl.createBuffer();
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, allColorVBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    allColorVBO.itemSize = 4;
    allColorVBO.numItems = N;
    while (byCenterColorVBO.length < centers.length) {
        byCenterColorVBO.push(gl.createBuffer());
    }
    for (i = 0; i < centers.length; i++) {
        gl.bindBuffer(gl.ARRAY_BUFFER, byCenterColorVBO[i]);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(centersC[i]), gl.STATIC_DRAW);
        byCenterColorVBO[i].itemSize = 4;
        byCenterColorVBO[i].numItems = centersC[i].length/4;
    }
    
    //Initialize edge buffers
    if (edgesVertexVBO == -1) {
        edgesVertexVBO = gl.createBuffer();
    }
    if (edgesColorVBO == -1) {
        edgesColorVBO = gl.createBuffer();   
    }
    var edgesV = [];
    var edgesC = [];
    var eNum;
    for (i = 0; i < edges.length; i++) {
        for (eNum = 0; eNum < 2; eNum++) {
            for (k = 0; k < 3; k++) {
                edgesV.push(DelaySeries[centers[edges[i][eNum]]][k]);
                edgesC.push(0.8);
            }
            edgesC.push(1);
        }
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, edgesVertexVBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(edgesV), gl.STATIC_DRAW);
    edgesVertexVBO.itemSize = 3;
    edgesVertexVBO.numItems = edges.length*2;
    gl.bindBuffer(gl.ARRAY_BUFFER, edgesColorVBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(edgesC), gl.STATIC_DRAW);
    edgesColorVBO.itemSize = 4;
    edgesColorVBO.numItems = edges.length*2;
    
    //Initialize center buffer
    if (centerVertexVBO == -1) {
        centerVertexVBO = gl.createBuffer();
    }
    if (centerColorVBO == -1) {
        centerColorVBO = gl.createBuffer();   
    }
    var centerV = [];
    var centerC = [];
    var eNum;
    for (i = 0; i < centers.length; i++) {
        for (k = 0; k < 3; k++) {
            centerV.push(DelaySeries[centers[i]][k]);
            centerC.push(0.8);
        }
        centerC.push(1);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, centerVertexVBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(centerV), gl.STATIC_DRAW);
    centerVertexVBO.itemSize = 3;
    centerVertexVBO.numItems = centers.length;
    gl.bindBuffer(gl.ARRAY_BUFFER, centerColorVBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(centerC), gl.STATIC_DRAW);
    centerColorVBO.itemSize = 4;
    centerColorVBO.numItems = centers.length;
    
    console.log("Finished initializing buffers");
    
    console.log("Centering camera on curve");
    //Now determine the bounding box of the curve and use
    //that to update the camera info
    var bbox = [vertices[0], vertices[0], vertices[1], vertices[1], vertices[2], vertices[2]];
    for (i = 0; i < N; i++) {
        if (vertices[i*3] < bbox[0]) {
            bbox[0] = vertices[i*3];
        }
        if (vertices[i*3] > bbox[1]) {
            bbox[1] = vertices[i*3];
        }
        if (vertices[i*3+1] < bbox[2]) {
            bbox[2] = vertices[i*3+1];
        }
        if (vertices[i*3+1] > bbox[3]) {
            bbox[3] = vertices[i*3+1];
        }
        if (vertices[i*3+2] < bbox[4]) {
            bbox[4] = vertices[i*3+2];
        }
        if (vertices[i*3+2] > bbox[5]) {
            bbox[5] = vertices[i*3+2];
        }
    }
    var dX = bbox[1] - bbox[0];
    var dY = bbox[3] - bbox[2];
    var dZ = bbox[5] - bbox[4];
    farR = Math.sqrt(dX*dX + dY*dY + dZ*dZ);
    camera.R = farR;
    camera.center = vec3.fromValues(bbox[0] + 0.5*dX, bbox[2] + 0.5*dY, bbox[4] + 0.5*dZ);
    camera.phi = Math.PI/2;
    camera.theta = -Math.PI/2;
    camera.updateVecsFromPolar();
    console.log("Finished centering camera");
    
    requestAnimFrame(repaint);   
}


function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    mat4.perspective(pMatrix, 45, gl.viewportWidth / gl.viewportHeight, camera.R/100.0, farR*2);
    mvMatrix = camera.getMVMatrix();

    if (allVertexVBO != -1 && allColorVBO != -1) {
        gl.useProgram(shaderProgram);
        setUniforms(shaderProgram);
        //Step 1: Draw all points unsaturated
        gl.bindBuffer(gl.ARRAY_BUFFER, allVertexVBO);
        gl.vertexAttribPointer(shaderProgram.vPosAttrib, allVertexVBO.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, allColorVBO);
        gl.vertexAttribPointer(shaderProgram.vColorAttrib, allColorVBO.itemSize, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.POINTS, 0, DelaySeries.length);
        //Draw Lines between points if the user so chooses
        if (displayTimeEdges) {
            gl.drawArrays(gl.LINES, 0, DelaySeries.length);
            gl.drawArrays(gl.LINES, 1, DelaySeries.length-1);
        }        
        
        //Step 2: Draw the cluster to which the current point in time belongs
        //with saturated colors
        //Find playing index with a linear search
        while (DelaySeries[playIdx][3] < playTime && playIdx < DelaySeries.length - 1) {
            playIdx++;
        }
        var label = DelaySeries[playIdx][4];
        gl.bindBuffer(gl.ARRAY_BUFFER, byCenterVertexVBO[label]);
        gl.vertexAttribPointer(shaderProgram.vPosAttrib, byCenterVertexVBO[label].itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, byCenterColorVBO[label]);
        gl.vertexAttribPointer(shaderProgram.vColorAttrib, byCenterColorVBO[label].itemSize, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.POINTS, 0, centerCounts[label]);
        
        
        //Output information about centers to the browser
        var centerNumText = document.getElementById('centerNumText');
        centerNumText.innerHTML = "" + label;
        var dimensionText = document.getElementById('dimensionText');
        dimensionText.innerHTML = "" + dims[label];
        
        //Step 3: Draw the current point as a larger point
        gl.useProgram(shaderProgram2);
        setUniforms(shaderProgram2);
        gl.bindBuffer(gl.ARRAY_BUFFER, allVertexVBO);
        gl.vertexAttribPointer(shaderProgram2.vPosAttrib, allVertexVBO.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, allColorVBO);
        gl.vertexAttribPointer(shaderProgram2.vColorAttrib, allColorVBO.itemSize, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.POINTS, playIdx, 1);
        
        //Step 4: Draw all centers and edges between them
        gl.useProgram(shaderProgram);
        setUniforms(shaderProgram);
        var idx = centers[label]; //TODO: Highlight current center
        gl.bindBuffer(gl.ARRAY_BUFFER, centerVertexVBO);
        gl.vertexAttribPointer(shaderProgram.vPosAttrib, centerVertexVBO.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, centerColorVBO);
        gl.vertexAttribPointer(shaderProgram.vColorAttrib, centerColorVBO.itemSize, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.POINTS, 0, centers.length);   
        
        if (displayScaffoldingEdges) {
            gl.bindBuffer(gl.ARRAY_BUFFER, edgesVertexVBO);
            gl.vertexAttribPointer(shaderProgram.vPosAttrib, edgesVertexVBO.itemSize, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, edgesColorVBO);
            gl.vertexAttribPointer(shaderProgram.vColorAttrib, edgesColorVBO.itemSize, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.LINES, 0, edges.length*2);   
        }
    }
}


function repaint() {
    drawScene();
}

function repaintWithContext(context) {
    if (playing) {
        playTime = context.currentTime - startTime + offsetTime;
        var timeSlider = document.getElementById('timeSlider');
        timeSlider.value = "" + parseInt(""+Math.round(playTime*1000.0/buffer.duration));
        drawScene();
        requestAnimFrame(function(){repaintWithContext(context)});
    }
    else {
        //If paused allow scrolling around
        playTime = offsetTime;
        drawScene();
    }
}


function webGLStart() {
    glcanvas = document.getElementById("LoopDittyGLCanvas");
    glcanvas.addEventListener("contextmenu", function(e){ e.stopPropagation(); e.preventDefault(); return false; }); //Need this to disable the menu that pops up on right clicking
    
    glcanvas.addEventListener('mousedown', makeClick);
    glcanvas.addEventListener('mouseup', releaseClick);
    glcanvas.addEventListener('mousemove', clickerDragged);
    glcanvas.addEventListener('mouseout', mouseOut);

    //Support for mobile devices
    glcanvas.addEventListener('touchstart', makeClick);
    glcanvas.addEventListener('touchend', releaseClick);
    glcanvas.addEventListener('touchmove', clickerDragged);
    
    initGL(glcanvas);
    initShaders();
    centers = [0];
    dims = [1];
    initGLBuffers(LOOP_DITTY_CURVE);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    
    requestAnimFrame(repaint);
}

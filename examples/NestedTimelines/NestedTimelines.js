(function (PIXI, lib) {

    var MovieClip = PIXI.animate.MovieClip;
    var Sprite = PIXI.Sprite;
    var fromFrame = PIXI.Texture.fromFrame;
    var Graphics = PIXI.Graphics;
    var shapes = PIXI.animate.ShapesCache;

    var Graphic1 = MovieClip.extend(function (mode) {
        MovieClip.call(this, { mode: mode, duration: 38, loop: false });
        var instance1 = new Sprite(fromFrame("Symbol 41"));
        this.addTimedChild(instance1);
    });

    lib.Side = MovieClip.extend(function () {
        MovieClip.call(this, {
            duration: 38
        });
        var instance1 = new Graphic1(MovieClip.SYNCHED);
        this.addTimedChild(instance1, 0, 38, {
            "0": {
                x: -55.05,
                y: -361.05,
                sx: 1,
                sy: 1
            },
            "1": {
                y: -360.2
            },
            "2": {
                y: -357.6
            },
            "3": {
                y: -353.25
            },
            "4": {
                y: -347.2
            },
            "5": {
                y: -339.4
            },
            "6": {
                y: -329.9
            },
            "7": {
                y: -318.65
            },
            "8": {
                y: -305.65
            },
            "9": {
                y: -290.95
            },
            "10": {
                y: -274.5
            },
            "11": {
                y: -256.3
            },
            "12": {
                y: -236.4
            },
            "13": {
                y: -214.75
            },
            "14": {
                y: -191.4
            },
            "15": {
                y: -166.3
            },
            "16": {
                y: -139.45
            },
            "17": {
                y: -110.9
            },
            "18": {
                x: -63.557,
                y: -98.496,
                sx: 1.155,
                sy: 0.886
            },
            "19": {
                x: -72.05,
                y: -86.05,
                sx: 1.309,
                sy: 0.773
            },
            "20": {
                x: -54.086,
                y: -117.9,
                sx: 0.982,
                sy: 1.066
            },
            "21": {
                x: -48.05,
                y: -128.5,
                sx: 0.873,
                sy: 1.164
            },
            "22": {
                x: -48.948,
                y: -156.66,
                sx: 0.888,
                sy: 1.144
            },
            "23": {
                x: -49.742,
                y: -183.015,
                sx: 0.903,
                sy: 1.125
            },
            "24": {
                x: -50.481,
                y: -207.559,
                sx: 0.916,
                sy: 1.108
            },
            "25": {
                x: -51.165,
                y: -230.242,
                sx: 0.928,
                sy: 1.092
            },
            "26": {
                x: -51.795,
                y: -251.171,
                sx: 0.94,
                sy: 1.077
            },
            "27": {
                x: -52.369,
                y: -270.236,
                sx: 0.95,
                sy: 1.064
            },
            "28": {
                x: -52.89,
                y: -287.445,
                sx: 0.96,
                sy: 1.052
            },
            "29": {
                x: -53.355,
                y: -302.895,
                sx: 0.968,
                sy: 1.041
            },
            "30": {
                x: -53.765,
                y: -316.538,
                sx: 0.976,
                sy: 1.031
            },
            "31": {
                x: -54.121,
                y: -328.369,
                sx: 0.982,
                sy: 1.023
            },
            "32": {
                x: -54.422,
                y: -338.342,
                sx: 0.988,
                sy: 1.016
            },
            "33": {
                x: -54.669,
                y: -346.507,
                sx: 0.992,
                sy: 1.01
            },
            "34": {
                x: -54.861,
                y: -352.863,
                sx: 0.996,
                sy: 1.006
            },
            "35": {
                x: -54.998,
                y: -357.462,
                sx: 0.998,
                sy: 1.003
            },
            "36": {
                x: -55.079,
                y: -360.15,
                sx: 0.999,
                sy: 1.001
            },
            "37": {
                x: -55.05,
                y: -361.05,
                sx: 1,
                sy: 1
            }
        });
    });

    lib.NestedTimelines = MovieClip.extend(function () {
        MovieClip.call(this, {
            duration: 65,
            framerate: 30
        });
        var instance2 = new Graphics()
            .drawCommands(shapes.NestedTimelines[0]);
        var instance1 = new lib.Side();
        this.addTimedChild(instance2)
            .addTimedChild(instance1, 0, 65, {
                "0": {
                    x: 55.05,
                    y: 719.8
                },
                "1": {
                    x: 92.8
                },
                "2": {
                    x: 130.5
                },
                "3": {
                    x: 168.25
                },
                "4": {
                    x: 206
                },
                "5": {
                    x: 243.75
                },
                "6": {
                    x: 281.5
                },
                "7": {
                    x: 319.25
                },
                "8": {
                    x: 357
                },
                "9": {
                    x: 394.75
                },
                "10": {
                    x: 432.5
                },
                "11": {
                    x: 470.2
                },
                "12": {
                    x: 507.95
                },
                "13": {
                    x: 545.7
                },
                "14": {
                    x: 583.45
                },
                "15": {
                    x: 621.2
                },
                "16": {
                    x: 658.9
                },
                "17": {
                    x: 696.65
                },
                "18": {
                    x: 734.4
                },
                "19": {
                    x: 772.15
                },
                "20": {
                    x: 809.9
                },
                "21": {
                    x: 847.65
                },
                "22": {
                    x: 885.35
                },
                "23": {
                    x: 923.1
                },
                "24": {
                    x: 960.85
                },
                "25": {
                    x: 998.6
                },
                "26": {
                    x: 1036.35
                },
                "27": {
                    x: 1074.1
                },
                "28": {
                    x: 1111.85
                },
                "29": {
                    x: 1149.55
                },
                "30": {
                    x: 1187.3
                },
                "31": {
                    x: 1225.05
                },
                "32": {
                    x: 1189.6
                },
                "33": {
                    x: 1154.15
                },
                "34": {
                    x: 1118.7
                },
                "35": {
                    x: 1083.2
                },
                "36": {
                    x: 1047.75
                },
                "37": {
                    x: 1012.3
                },
                "38": {
                    x: 976.85
                },
                "39": {
                    x: 941.4
                },
                "40": {
                    x: 905.95
                },
                "41": {
                    x: 870.5
                },
                "42": {
                    x: 835.05
                },
                "43": {
                    x: 799.6
                },
                "44": {
                    x: 764.15
                },
                "45": {
                    x: 728.7
                },
                "46": {
                    x: 693.25
                },
                "47": {
                    x: 657.8
                },
                "48": {
                    x: 622.3
                },
                "49": {
                    x: 586.85
                },
                "50": {
                    x: 551.4
                },
                "51": {
                    x: 515.95
                },
                "52": {
                    x: 480.5
                },
                "53": {
                    x: 445.05
                },
                "54": {
                    x: 409.6
                },
                "55": {
                    x: 374.15
                },
                "56": {
                    x: 338.7
                },
                "57": {
                    x: 303.25
                },
                "58": {
                    x: 267.8
                },
                "59": {
                    x: 232.35
                },
                "60": {
                    x: 196.85
                },
                "61": {
                    x: 161.4
                },
                "62": {
                    x: 125.95
                },
                "63": {
                    x: 90.5
                },
                "64": {
                    x: 55.05
                }
            });
    });

    lib.NestedTimelines.assets = {
        "NestedTimelines": "images/NestedTimelines.shapes.json",
        "NestedTimelines_atlas_1": "images/NestedTimelines_atlas_1.json"
    };
})(PIXI, lib = lib || {});
var lib;
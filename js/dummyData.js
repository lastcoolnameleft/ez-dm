
setDummyData = function() {
    activeEncounterId = 4;

    encounterList = {
        2 : {
            'name' : 'Dicks of Doom',
            'pcList' : [5,6],
            'npcList' : [7], 
        },
        3 : {
            'name' : 'Shadows over Miami',
            'pcList' : [],
            'npcList' : [8], 
        },
        4 : {
            'name' : 'Mirrored ceiling',
            'pcList' : [5,6],
            'npcList' : [9], 
        }
    };


    pcList = {
        5 : {
            'name'       : 'Umine',
            'currentHP'  : 10,
            'maxHP'      : 100,
            'initiative' : 13,
            'ac'         : 26,
            'fortitude'  : 18,
            'reflex'     : 15,
            'will'       : 14,
            'imgUrl'     : 'img/fry.jpg'
        },
        6 : {
            'name'       : 'Eldon',
            'currentHP'  : 10,
            'maxHP'      : 50,
            'initiative' : 18,
            'ac'         : 20,
            'fortitude'  : 18,
            'reflex'     : 19,
            'will'       : 19,
            'imgUrl'     : 'img/bender.png'
        },
    };

    npcList = {
        7 : {
            'name'       : 'Baddy #1',
            'currentHP'  : 100,
            'maxHP'      : 100,
            'initiative' : 14,
            'ac'         : 26,
            'fortitude'  : 18,
            'reflex'     : 15,
            'will'       : 14,
            'imgUrl'     : 'img/hypnotoad.jpg'
        },
        8 : {
            'name'       : 'Baddy #2',
            'currentHP'  : 50,
            'maxHP'      : 50,
            'initiative' : 12,
            'ac'         : 20,
            'fortitude'  : 18,
            'reflex'     : 19,
            'will'       : 19,
            'imgUrl'     : 'img/nibbler.png'
        },
        9 : {
            'name'       : 'Baddy #3',
            'currentHP'  : 50,
            'maxHP'      : 50,
            'initiative' : 10,
            'ac'         : 20,
            'fortitude'  : 18,
            'reflex'     : 19,
            'will'       : 19,
            'imgUrl'     : 'img/mom.jpg'
        },
    };

}

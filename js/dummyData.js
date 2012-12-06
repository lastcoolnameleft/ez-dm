window.dmtool.datafill = function(model, ui) {
    var self = this;
    self.dmModel = model;
    self.ui = ui;

    self.sampleCreatureData = {
        'name' : 'Mr. Creature',
        'class' : 'Fighter',
        'level' : 8,
        'maxHp' : 200,
        'ac' : 23,
        'fortitude' : 19,
        'reflex' : 17,
        'will' : 18,
    }

    self.datafillCreateFields = function() {
        self.ui.datafillCreatureFields('createPc', self.sampleCreatureData);
        self.ui.datafillCreatureFields('createNpc', self.sampleCreatureData);
        $('#createEncounterName').val('Fearsome Encounter');
    }

    self.setDummyData = function(model) {
        model.activeEncounterId = 4;

        model.nextEncounterListId = 6;
        model.encounterList = {
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
            },
            5 : {
                'name' : 'Peanuts and Dancing',
                'pcList' : [5],
                'npcList' : [8], 
            },
        };

        model.nextPcListId = 7;
        model.pcList = {
            0 : {
                'id'         : 5,
                'name'       : 'Umine',
                'class'      : 'Cleric',
                'level'      : 8,
                'currentHp'  : 10,
                'maxHp'      : 100,
                'initiative' : 13,
                'ac'         : 26,
                'fortitude'  : 18,
                'reflex'     : 15,
                'will'       : 14,
                'imgUrl'     : 'img/fry.jpg'
            },
            1 : {
                'id'         : 6,
                'name'       : 'Eldon',
                'class'      : 'Warlock',
                'level'      : 8,
                'currentHp'  : 10,
                'maxHp'      : 50,
                'initiative' : 18,
                'ac'         : 20,
                'fortitude'  : 18,
                'reflex'     : 19,
                'will'       : 19,
                'imgUrl'     : 'img/bender.png'
            },
        };

        model.nextPcListId = 10;
        model.npcList = {
            0 : {
                'id'         : 7,
                'name'       : 'Baddy #1',
                'currentHp'  : 100,
                'maxHp'      : 100,
                'initiative' : 14,
                'ac'         : 26,
                'fortitude'  : 18,
                'reflex'     : 15,
                'will'       : 14,
                'imgUrl'     : 'img/hypnotoad.jpg'
            },
            1 : {
                'id'         : 8
                'name'       : 'Baddy #2',
                'currentHp'  : 50,
                'maxHp'      : 50,
                'initiative' : 12,
                'ac'         : 20,
                'fortitude'  : 18,
                'reflex'     : 19,
                'will'       : 19,
                'imgUrl'     : 'img/nibbler.png'
            },
            2 : {
                'id'         : 9,
                'name'       : 'Baddy #3',
                'currentHp'  : 50,
                'maxHp'      : 50,
                'initiative' : 10,
                'ac'         : 20,
                'fortitude'  : 18,
                'reflex'     : 19,
                'will'       : 19,
                'imgUrl'     : 'img/mom.jpg'
            },
        };

    }

    return self;
}

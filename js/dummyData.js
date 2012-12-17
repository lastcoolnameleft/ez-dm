window.dmtool.datafill = function(model, ui) {
    var self = this;
    self.dmModel = model;
    self.ui = ui;

    self.sampleCreatureData = {
        'name' : 'Mr. Creature',
        'level' : 8,
        'maxHp' : 200,
        'ac' : 23,
        'fortitude' : 19,
        'reflex' : 17,
        'will' : 18,
    }

    self.datafillCreateFields = function() {
        self.ui.datafillCreatureFields('createCreature_popup', self.sampleCreatureData);
        $('#createEncounterName').val('Fearsome Encounter');
    }

    self.setDummyData = function(model) {
        model.activeEncounterId = 2;

        model.nextEncounterListId = 9;
        model.encounterList = {
            1 : {
                'id' : 2,
                'name' : 'Dicks of Doom',
                'creatureList' : [5,6,7],
            },
            4 : {
                'id' : 3,
                'name' : 'Shadows over Miami',
                'creatureList' : [8], 
            },
            6 : {
                'id' : 5,
                'name' : 'Mirrored ceiling',
                'creatureList' : [5,6,9],
            },
            8 : {
                'id' : 6,
                'name' : 'Peanuts and Dancing',
                'creatureList' : [5, 8],
            },
        };

        model.nextCreatureListId = 12;
        model.creatureList = {
            3 : {
                'id'         : 5,
                'type'       : 'pc',
                'name'       : 'Umine',
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
            5 : {
                'id'         : 6,
                'type'       : 'pc',
                'name'       : 'Eldon',
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
            7 : {
                'id'         : 7,
                'type'       : 'npc',
                'name'       : 'Baddy #1',
                'level'      : 5,
                'currentHp'  : 100,
                'maxHp'      : 100,
                'initiative' : 14,
                'ac'         : 26,
                'fortitude'  : 18,
                'reflex'     : 15,
                'will'       : 14,
                'imgUrl'     : 'img/hypnotoad.jpg'
            },
            9 : {
                'id'         : 8,
                'type'       : 'npc',
                'name'       : 'Baddy #2',
                'level'      : 5,
                'currentHp'  : 50,
                'maxHp'      : 50,
                'initiative' : 12,
                'ac'         : 20,
                'fortitude'  : 18,
                'reflex'     : 19,
                'will'       : 19,
                'imgUrl'     : 'img/nibbler.jpg'
            },
            11 : {
                'id'         : 9,
                'type'       : 'npc',
                'name'       : 'Baddy #3',
                'level'      : 5,
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

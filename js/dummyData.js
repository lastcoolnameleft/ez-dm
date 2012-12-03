datafillCreateFields = function() {
    $('#createPcName').val('PC #10');
    $('#createPcClass').val('Fighter');
    $('#createPcLevel').val(8);
    $('#createPcMaxHp').val(200);
    $('#createPcAc').val(23);
    $('#createPcFortitude').val(19);
    $('#createPcReflex').val(17);
    $('#createPcWill').val(18);
    $('#createNpcName').val('NPC #10');
    $('#createNpcClass').val('Cleric');
    $('#createNpcLevel').val(8);
    $('#createNpcMaxHp').val(200);
    $('#createNpcAc').val(23);
    $('#createNpcFortitude').val(19);
    $('#createNpcReflex').val(17);
    $('#createNpcWill').val(18);
    $('#createEncounterName').val('Encounter #10');
}

setDummyData = function() {
    activeEncounterId = 4;

    nextEncounterListId = 6;
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
        },
        5 : {
            'name' : 'Peanuts and Dancing',
            'pcList' : [5],
            'npcList' : [8], 
        },
    };


    nextPcListId = 7;
    pcList = {
        5 : {
            'name'       : 'Umine',
            'currentHp'  : 10,
            'maxHp'      : 100,
            'initiative' : 13,
            'ac'         : 26,
            'fortitude'  : 18,
            'reflex'     : 15,
            'will'       : 14,
            'imgUrl'     : 'img/fry.jpg'
        },
        6 : {
            'name'       : 'Eldon',
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

    nextPcListId = 10;
    npcList = {
        7 : {
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
        8 : {
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
        9 : {
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

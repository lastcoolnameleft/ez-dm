window.initApp = function () {
    var dmToolModel    = new dmtool.model();
    var dmToolUi       = new dmtool.ui( dmToolModel );
    var dmToolDatafill = new dmtool.datafill( dmToolModel );

    dmToolDatafill.setDummyData(dmToolModel);
    dmToolDatafill.datafillCreateFields();

    dmToolUi.refreshEncounterList();
    dmToolUi.addPopupBindings();
    dmToolUi.setEncounterName(dmToolModel.encounterList[dmToolModel.activeEncounterId]['name']);
}

window.dmtool = {};

window.dmtool.model = function() {
    var self = this;

    self.activeEncounterId = 0;
    self.nextEncounterListId = 0;
    self.encounterList = {};
    self.nextPcListId = 0;
    self.pcList = {};
    self.nextPcListId = 0;
    self.npcList = {};

    self.setActiveCreatureList = function(creatureList) {
        activeCreatureList = creatureList;
    }

    self.getEncounterList = function() {
        return encounterList;
    }

    self.getCreatureListFromEncounter = function(encounterId, encounterList, pcList, npcList) {
        var creatureList = [];
     
        var activePcList = encounterList[encounterId]['pcList'];
        for (pcId in activePcList) {
            creatureList.push(pcList[activePcList[pcId]]);
        }
        var activeNpcList = encounterList[encounterId]['npcList'];
        for (npcId in activeNpcList) {
            creatureList.push(npcList[activeNpcList[npcId]]);
        }
        return creatureList;
    }


    self.createEncounter = function( name ) {
        var encounterInfo = { 'name' : name, 'pcList' : [], 'npcList' : [] };
        self.encounterList[ self.nextEncounterListId ] = encounterInfo;
        self.nextEncounterListId++;
    }
    return self;
}

window.dmtool.ui = function( dmToolModel ) {
    var self = this;

    self.dmModel = dmToolModel;

    self.refreshEncounterList = function() {
        activeCreatureList = dmToolModel.getCreatureListFromEncounter(self.dmModel.activeEncounterId, self.dmModel.encounterList, self.dmModel.pcList, self.dmModel.npcList);
        self.addCreaturesToEncounterList(activeCreatureList);
    }

    self.addUser = function (name, currentHp, maxHp, initiative, ac, fortitude, reflex, will, imgUrl) {
        liString = '<li data-theme="c"><a href="#popupEditPcEncounter" data-rel="popup"><img src="' + imgUrl + '" /><h1>' + name + '</h1><p>HP:' + currentHp + '/' + maxHp + 'Init:' + initiative + '</p><span class="ui-li-count">AC: ' + ac + ' For: ' + fortitude + ' Ref: ' + reflex + ' Wil: ' + will + '</span></a><a href="#popupEditCreature" data-rel="popup"></a></li>';
        $( '#sortable' ).append(liString).listview("refresh");
    };

    self.setEncounterName = function(encounterName) {
        $( '#headerEncounterName' ).text( encounterName );
    }

    // http://stackoverflow.com/questions/8399882/jquery-mobile-collapsible-expand-collapse-event
    // http://jquerymobile.com/demos/1.2.0/docs/pages/popup/events.html
    self.addPopupBindings = function() {
        $('#popupEdit').on('popupbeforeposition', function () { self.datafillPopup('#popupEditPc', 'popup', '#popupEditCreature', self.dmModel.pcList) });
        $('#popupEdit').on('popupbeforeposition', function () { self.datafillPopup('#popupEditNpc', 'popup', '#popupEditCreature', self.dmModel.npcList) });
        $('#popupEdit').on('popupbeforeposition', function () { self.datafillPopup('#popupEditEncounter', 'popup', '#popupEditEncounter', self.dmModel.encounterList) });
        $('#popupAdd').on('popupbeforeposition', function () { self.datafillPopup('#popupAddPc', 'dialog', 'addCreature.html', self.dmModel.pcList) });
        $('#popupAdd').on('popupbeforeposition', function () { self.datafillPopup('#popupAddNpc', 'dialog', 'addCreature.html', self.dmModel.npcList) });
        $('#popupAdd').on('popupbeforeposition', function () { self.datafillPopup('#popupAddEncounter', 'dialog', '#popupAddEncounter', self.dmModel.encounterList) });
        $('#createPcButton').on('click', function () { self.submitCreatePc() });
        $('#createNpcButton').on('click', function () { self.submitCreateNpc() });
        $('#createEncounterButton').on('click', function () { self.submitCreateEncounter() });
    }

    self.datafillPopup = function(divId, dataRel, link, list) {
        $(divId + ' ul').html('');
        for ( id in list) {
            $(divId + ' ul').append('<li><a href="' + link + '" data-position-to="window" class="ui-btn-left" data-rel="' + dataRel + '">' + list[id]['name'] + '</a></li>').listview('refresh');
        }
    }

    self.submitCreateEncounter = function() {
        $( "#popupCreateEncounter" ).popup( "close" );
        var encounterName = $( '#createEncounterName' ).val();
        self.dmModel.createEncounter(encounterName);     
    }

    self.submitCreatePc = function() {
        $( "#popupCreatePc" ).popup( "close" );
        var newPcInfo = { 
            'name'       : $( '#createPcName' ).val(), 
            'maxHp'      : $( '#createPcMaxHp' ).val(), 
            'initiative' : 0, 
            'ac'         : $( '#createPcAc' ).val(), 
            'fortitude'  : $( '#createPcFortitude' ).val(),
            'reflex'     : $( '#createPcReflex' ).val(), 
            'will'       : $( '#createPcWill' ).val(), 
            'imgUrl'     : 'img/leela.jpg'
        };
        self.dmModel.pcList[ self.dmModel.nextPcListId ] = newPcInfo;
        self.dmModel.nextPcListId++;
    }

    self.submitCreateNpc = function() {
        $( "#popupCreatePc" ).popup( "close" );
        var newNpcInfo = { 
            'name'       : $( '#createNpcName' ).val(), 
            'maxHp'      : $( '#createNpcMaxHp' ).val(), 
            'initiative' : 0, 
            'ac'         : $( '#createNpcAc' ).val(), 
            'fortitude'  : $( '#createNpcFortitude' ).val(),
            'reflex'     : $( '#createNpcReflex' ).val(), 
            'will'       : $( '#createNpcWill' ).val(), 
            'imgUrl'     : 'img/nibbler.jpg'
        };
        self.dmModel.npcList[ self.dmModel.nextNpcListId ] = newNpcInfo;
        self.dmModel.nextNpcListId++;
    }

    self.addCreaturesToEncounterList = function(creatureList) { 
        sortedCreatureList = creatureList.sort(self.sortByInitiative);
        for ( var creatureId in sortedCreatureList ) {
            self.addUser(creatureList[creatureId]['name'], creatureList[creatureId]['currentHp'], creatureList[creatureId]['maxHp'], creatureList[creatureId]['initiative'], creatureList[creatureId]['ac'], creatureList[creatureId]['fortitude'], creatureList[creatureId]['reflex'], creatureList[creatureId]['will'], creatureList[creatureId]['imgUrl']);
        }
    }

    self.sortByInitiative = function(a, b) {
        return( b.initiative - a.initiative );
    }
    return self;
}


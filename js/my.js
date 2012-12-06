fuck = {};
window.dmtool = {};

window.dmtool.app = function() {
    var self = this;

    self.dmToolModel    = new dmtool.model();
    self.dmToolUi       = new dmtool.ui( self.dmToolModel );
    self.dmToolDatafill = new dmtool.datafill( self.dmToolModel, self.dmToolUi );

    self.dmToolDatafill.setDummyData(self.dmToolModel);
    self.dmToolDatafill.datafillCreateFields();

    self.dmToolUi.refreshEncounterList();
    self.dmToolUi.addPopupBindings();
    self.dmToolUi.setEncounterName(self.dmToolModel.encounterList[self.dmToolModel.activeEncounterId]['name']);
    self.dmToolUi.initializeAddCreature();

    return self;
}

window.dmtool.model = function() {
    var self = this;

    self.activeEncounterId = 0;
    self.nextEncounterListId = 0;
    self.encounterList = {};
    self.nextPcListId = 0;
    self.pcList = {};
    self.nextPcListId = 0;
    self.npcList = {};

    self.getCreatureDataFromId = function ( id, creatureList ) {
        for ( key in creatureList ) {
            if ( creatureList[key]['id'] == id ) {
                return creatureList[key];
            }
        }
        return {};
    }

    self.getPcDataFromId = function( id ) {
        return self.getCreatureDataFromId(id, this.getPcList());
    }

    self.getNpcDataFromId = function( id ) {
        return self.getCreatureDataFromId(id, this.getNpcList());
    }

    self.getPcList = function() {
        return this.pcList;
    }

    self.getNpcListList = function() {
        return this.npcList;
    }

    self.getEncounterList = function() {
        return encounterList;
    }

    self.updateCreature = function( id, creatureData, creatureList ) {
        for ( key in creatureData ) {
            creatureList[pcId][key] = creatureData[key];
        }
    }

    self.updatePc = function( pcId, pcData ) {
        return self.updateCreature( pcId, pcData, this.getPcList() );
    }

    self.updateNpc = function( npcId, npcData ) {
        return self.updateCreature( npcId, npcData, this.getNpcList() );
    }

    self.setActiveCreatureList = function(creatureList) {
        this.activeCreatureList = creatureList;
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
        $( '#encounterCreatureList' ).empty();
        activeCreatureList = dmToolModel.getCreatureListFromEncounter(self.dmModel.activeEncounterId, self.dmModel.encounterList, self.dmModel.pcList, self.dmModel.npcList);
        self.addCreaturesToEncounterList(activeCreatureList);
    }

    self.addCreatureToEncounterList = function (id, creatureInfo) { 
        var popupEditPcEncounterId = 'popupEditPcEncounter_' + id;
        liString = '<li data-theme="c"><a href="#popupEditPcEncounter" data-rel="popup"><img src="' + creatureInfo['imgUrl'] + '" /><h1>' + creatureInfo['name'] + '</h1><p>HP:' + creatureInfo['currentHp'] + '/' + creatureInfo['maxHp'] + ' Init:' + creatureInfo['initiative'] + '</p><span class="ui-li-count">AC: ' + creatureInfo['ac'] + ' For: ' + creatureInfo['fortitude'] + ' Ref: ' + creatureInfo['reflex'] + ' Wil: ' + creatureInfo['will'] + '</span></a><a href="#popupEditCreature" data-rel="popup" data-position-to="window" id="' + popupEditPcEncounterId + '"></a></li>';
        $( '#encounterCreatureList' ).append(liString).listview("refresh");
        $('#' + popupEditPcEncounterId).on('click', function() { 
            self.initPopupEditCreature(id, creatureInfo); 
        });
    }

    self.setEncounterName = function(encounterName) {
        $( '#headerEncounterName' ).text( encounterName );
    }

    // http://stackoverflow.com/questions/8399882/jquery-mobile-collapsible-expand-collapse-event
    // http://jquerymobile.com/demos/1.2.0/docs/pages/popup/events.html
    self.addPopupBindings = function() {
        $('#popupEdit').on('popupbeforeposition', function () { self.datafillPopupSpecial('popupEditPc', 'popup', 'popupEditCreature', self.dmModel.pcList) });
        $('#popupEdit').on('popupbeforeposition', function () { self.datafillPopup('#popupEditNpc', 'popup', '#popupEditCreature', self.dmModel.npcList) });
        $('#popupEdit').on('popupbeforeposition', function () { self.datafillPopup('#popupEditEncounter', 'popup', '#popupEditEncounter', self.dmModel.encounterList) });
        $('#popupAdd').on('popupbeforeposition', function () { self.datafillPopup('#popupAddPc', 'dialog', 'addCreature.html', self.dmModel.pcList) });
        $('#popupAdd').on('popupbeforeposition', function () { self.datafillPopup('#popupAddNpc', 'dialog', 'addCreature.html', self.dmModel.npcList) });
        $('#popupAdd').on('popupbeforeposition', function () { self.datafillPopup('#popupAddEncounter', 'dialog', '#popupAddEncounter', self.dmModel.encounterList) });
        $('#createPcButton').on('click', function () { self.submitCreatePc() });
        $('#createNpcButton').on('click', function () { self.submitCreateNpc() });
        $('#createEncounterButton').on('click', function () { self.submitCreateEncounter() });

//  For asking initiative
        $('#popupAdd').on('popupbeforeposition', function () { self.datafillPopup('#popupAddPc', 'popup', '#popupAddCreature', self.dmModel.pcList) });
    }

    self.initPopupEditCreature = function( id, creatureData ) {
       self.datafillCreatureFields('popupEditCreature', creatureData); 
        $('#editCreatureSubmitButton').on('click', function() { 
            $( "#popupEditCreature" ).popup( "close" );
            submitCreatureData = self.fetchCreatureDataFromFields('popupEditCreature');
            self.dmModel.updatePc( id, submitCreatureData );
            self.refreshEncounterList();
        });
    }

    self.datafillPopup = function(divId, dataRel, link, list) {
        $(divId + ' ul').html('');
        for ( id in list) {
            $(divId + ' ul').append('<li><a href="' + link + '" data-position-to="window" class="ui-btn-left" data-rel="' + dataRel + '">' + list[id]['name'] + '</a></li>').listview('refresh');
        }
    }

    self.datafillPopupSpecial = function(divId, dataRel, link, list) {
        $('#' + divId + ' ul').html('');
        for ( id in list) {
            domId = link + '_' + divId + '_' + id; 
            name = list[id]['name'];
            li = '<li><a href="#' + link + '" id="' + domId + '" data-position-to="window" class="ui-btn-left" data-rel="' + dataRel + '">' + name + '</a></li>';
            $('#' + divId + ' ul').append(li).listview('refresh');
            $('#' + domId).on('click', function() { self.initPopupEditCreature(id, list[id]); }); 
        }
    }

    self.datafillCreatureFields = function(prefix, list) {
        for ( id in list ) {
            $('#' + prefix + '_' + id).val( list[ id ] );
        }
    }

    self.submitCreateEncounter = function() {
        $( "#popupCreateEncounter" ).popup( "close" );
        var encounterName = $( '#createEncounterName' ).val();
        self.dmModel.createEncounter(encounterName);     
    }

    self.fetchCreatureDataFromFields = function( prefix ) {
        var fieldList = ['name', 'maxHp', 'ac', 'fortitude', 'reflex', 'will'];
        var creatureData = {};
        for ( id in fieldList )  {
            creatureData[fieldList[id]] = $( '#' + prefix + '_' + fieldList[id] ).val();
        }
        return creatureData;
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
            'name'       : $( '#createNpc_name' ).val(), 
            'maxHp'      : $( '#createNpc_maxHp' ).val(), 
            'initiative' : 0, 
            'ac'         : $( '#createNpc_ac' ).val(), 
            'fortitude'  : $( '#createNpc_fortitude' ).val(),
            'reflex'     : $( '#createNpc_reflex' ).val(), 
            'will'       : $( '#createNpc_will' ).val(), 
            'imgUrl'     : 'img/nibbler.jpg'
        };

        self.dmModel.npcList[ self.dmModel.nextNpcListId ] = newNpcInfo;
        self.dmModel.nextNpcListId++;
    }

    self.addCreaturesToEncounterList = function(creatureList) { 
        sortedCreatureList = creatureList.sort(self.sortByInitiative);
        for ( var creatureId in sortedCreatureList ) {
            self.addCreatureToEncounterList(creatureId, creatureList[creatureId]);
        }
    }

    self.sortByInitiative = function(a, b) {
        return( b.initiative - a.initiative );
    }

    self.initializeAddCreature = function() {
        $(function(){
            $('#popupAddCreatureInitiative').scroller({
                preset: 'select',
                theme: 'default',
                display: 'inline',
                mode: 'scroller',
                inputClass: 'i-txt'
            });

            //  Stupid mobiscroll.  Why do you add this dummy thing?
            $('#popupAddCreatureInitiative_dummy').hide();
        });

    }

    return self;
}


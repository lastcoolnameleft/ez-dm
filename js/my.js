window.dmtool = {};


window.dmtool.app = function () {
    var self = this;

    self.dmToolModel      = new window.dmtool.model();
    self.dmToolUi         = new window.dmtool.ui( self.dmToolModel );
    self.dmToolDatafill   = new window.dmtool.datafill( self.dmToolModel, self.dmToolUi);

    //  I want to be able to see this!
    window.dmToolModel = self.dmToolModel;
    window.dmToolUi = self.dmToolUi;

    self.dmToolDatafill.setDummyData(self.dmToolModel);
    self.dmToolDatafill.datafillCreateFields();

    self.dmToolUi.refreshEncounterList();
    self.dmToolUi.addPopupBindings();
    self.dmToolUi.setEncounterName(self.dmToolModel.getEncounterDataFromEncounterId(self.dmToolModel.activeEncounterId)['name']);
    self.dmToolUi.initializeAddCreature();

    return self;
}

window.dmtool.model = function () {
    var self = this;

    self.activeEncounterId = 0;
    self.nextEncounterListId = 0;
    self.encounterList = {};
    self.nextCreatureListId = 0;
    self.creatureList = {};

    self.getCreatureDataFromId = function ( id ) {
        for ( key in self.creatureList ) {
            if ( self.creatureList[key]['id'] == id ) {
                return self.creatureList[key];
            }
        }
        return;
    }

    self.getCreatureTypeFromList = function( type ) {
        result = [];
        for (key in self.creatureList ) {
            if ( self.creatureList[key]['type'] == type ) {
               result.push(self.creatureList[key]);
            }
        }
        return result;
    }

    self.getPcList = function () {
        return self.getCreatureTypeFromList( 'pc' );
    }

    self.getNpcList = function () {
        return self.getCreatureTypeFromList( 'npc' );
    }

    self.getEncounterList = function () {
        return self.encounterList;
    }

    self.updateCreature = function ( id, creatureData ) {
        creatureToUpdate = self.getCreatureDataFromId(id);
        for ( key in creatureData ) {
            creatureToUpdate[key] = creatureData[key];
        }
    }

    self.setActiveCreatureList = function (creatureList) {
        self.activeCreatureList = creatureList;
    }

    self.getCreatureListFromEncounter = function (encounterId) {
        var creatureList = [];
    
        encounterData = self.getEncounterDataFromEncounterId( encounterId ); 
        var activeCreatureList = encounterData['creatureList'];
        for (var id in activeCreatureList) {
            creatureList.push(self.getCreatureDataFromId(activeCreatureList[id]));
        }
        return creatureList;
    }

    self.getEncounterDataFromEncounterId = function ( encounterId ) {
        for ( var id in self.encounterList) {
            if ( self.encounterList[id]['id'] == encounterId ) {
                return self.encounterList[id];
            }
        }
        return;
    }

    self.createEncounter = function ( name ) {
        var encounterInfo = { 'id' : self.nextEncounterListId, 'name' : name, 'creatureList' : [] };
        self.encounterList.push( encounterInfo );
        self.nextEncounterListId++;
    }

    return self;
};

window.dmtool.ui = function( dmToolModel ) {
    var self = this;

    self.dmModel = dmToolModel;

    self.submitCreateEncounter = function() {
        $( "#popupCreateEncounter" ).popup( "close" );
        var encounterName = $( '#createEncounterName' ).val();
        self.dmModel.createEncounter(encounterName);     
    }

    self.clearEncounterCreatureList = function() {
        $( '#encounterCreatureList' ).empty();
    }

    self.addCreatureToEncounterList = function (id, creatureInfo) { 
        var popupEditPcEncounterId = 'popupEditPcEncounter_' + id;
        liString = '<li data-theme="c"><a href="#popupEditPcEncounter" data-rel="popup"><img src="' + creatureInfo['imgUrl'] + '" /><h1>' + creatureInfo['name'] + '</h1><p>HP:' + creatureInfo['currentHp'] + '/' + creatureInfo['maxHp'] + ' Init:' + creatureInfo['initiative'] + '</p><span class="ui-li-count">AC: ' + creatureInfo['ac'] + ' For: ' + creatureInfo['fortitude'] + ' Ref: ' + creatureInfo['reflex'] + ' Wil: ' + creatureInfo['will'] + '</span></a><a href="#popupEditCreature" data-rel="popup" data-position-to="window" id="' + popupEditPcEncounterId + '"></a></li>';
        $( '#encounterCreatureList' ).append(liString).listview("refresh");
        $('#' + popupEditPcEncounterId).on('click', self.datafillEditCreatureFormPopup(creatureInfo['id']));
    }

    self.setEncounterName = function(encounterName) {
        $( '#headerEncounterName' ).text( encounterName );
    }

    // http://stackoverflow.com/questions/8399882/jquery-mobile-collapsible-expand-collapse-event
    // http://jquerymobile.com/demos/1.2.0/docs/pages/popup/events.html
    self.addPopupBindings = function() {
        $('#popupEdit').on('popupbeforeposition', function () { self.datafillEditCreatureListPopup('popupEditPc', 'popup', 'popupEditCreature', self.dmModel.getPcList()) });
        $('#popupEdit').on('popupbeforeposition', function () { self.datafillEditCreatureListPopup('popupEditNpc', 'popup', 'popupEditCreature', self.dmModel.getNpcList() ) });
        $('#popupEdit').on('popupbeforeposition', function () { self.datafillPopup('#popupEditEncounter', 'popup', '#popupEditEncounter', self.dmModel.getEncounterList() ) });
        $('#popupAdd').on('popupbeforeposition', function () { self.datafillPopup('#popupAddPc', 'dialog', 'addCreature.html', self.dmModel.getPcList() ) });
        $('#popupAdd').on('popupbeforeposition', function () { self.datafillPopup('#popupAddNpc', 'dialog', 'addCreature.html', self.dmModel.getNpcList() ) });
        $('#popupAdd').on('popupbeforeposition', function () { self.datafillPopup('#popupAddEncounter', 'dialog', '#popupAddEncounter', self.dmModel.getEncounterList() ) });

        $('#popupCreatePc').on('click', function () { self.clickCreatePc() });
        $('#popupCreateNpc').on('click', function () { self.clickCreateNpc() });

        $('#createCreatureButton').on('click', function () { self.submitCreateCreature() });
        $('#createEncounterButton').on('click', function () { self.submitCreateEncounter() });

//  For asking initiative
        $('#popupAdd').on('popupbeforeposition', function () { self.datafillPopup('#popupAddPc', 'popup', '#popupAddCreature', self.dmModel.getPcList() ) });
    }

    self.clickCreatePc = function () {
        var encounterName = $( '#createCreature_type' ).val('pc');
    }

    self.clickCreateNpc = function () {
        var encounterName = $( '#createCreature_type' ).val('npc');
    }

    self.initPopupEditCreature = function( id, creatureData ) {
       self.datafillCreatureFields('popupEditCreature', creatureData); 
        $('#editCreatureSubmitButton').off('click');
        $('#editCreatureSubmitButton').on('click', function() { 
            $( "#popupEditCreature" ).popup( "close" );
            submitCreatureData = self.fetchCreatureDataFromFields('popupEditCreature');
            self.dmModel.updateCreature( id, submitCreatureData );
            self.refreshEncounterList();
        });
    }

    
    self.datafillPopup = function(divId, dataRel, link, list) {
        $(divId + ' ul').html('');
        for ( var id in list) {
            $(divId + ' ul').append('<li><a href="' + link + '" data-position-to="window" class="ui-btn-left" data-rel="' + dataRel + '">' + list[id]['name'] + '</a></li>').listview('refresh');
        }
    }

    self.datafillEditCreatureListPopup = function(divId, dataRel, link, list) {
        $('#' + divId + ' ul').html('');
        for ( var id in list) {
            var domId = link + '_' + divId + '_' + id; 
            var name = list[id]['name'];
            var li = '<li><a href="#' + link + '" id="' + domId + '" data-position-to="window" class="ui-btn-left" data-rel="' + dataRel + '">' + name + '</a></li>';
            $('#' + divId + ' ul').append(li).listview('refresh');
            $('#' + domId).on('click', self.datafillEditCreatureFormPopup(list[id]['id']));
        }
    }

    self.datafillEditCreatureFormPopup = function(id) { 
        return function() {
            var creatureData = self.dmModel.getCreatureDataFromId(id);
            self.initPopupEditCreature(id, creatureData); 
        }
    }
    self.datafillCreatureFields = function(prefix, list) {
        for ( id in list ) {
            $('#' + prefix + '_' + id).val( list[ id ] );
        }
    }

    self.fetchCreatureDataFromFields = function( prefix ) {
        var fieldList = ['name', 'maxHp', 'ac', 'fortitude', 'reflex', 'will'];
        var creatureData = {};
        for ( id in fieldList )  {
            creatureData[fieldList[id]] = $( '#' + prefix + '_' + fieldList[id] ).val();
        }
        return creatureData;
    }

    self.submitCreateCreature = function() {
        //  Probably shouldn't close both.  
        $( "#popupCreateCreature" ).popup( "close" );
        var newCreatureInfo = { 
            'id'         : self.dmModel.nextCreatureListId,
            'type'       : $( '#createCreature_type' ).val(),
            'name'       : $( '#createCreature_name' ).val(), 
            'maxHp'      : $( '#createCreature_maxHp' ).val(), 
            'initiative' : 0, 
            'ac'         : $( '#createCreature_ac' ).val(), 
            'fortitude'  : $( '#createCreature_fortitude' ).val(),
            'reflex'     : $( '#createCreature_reflex' ).val(), 
            'will'       : $( '#createCreature_will' ).val(), 
            'imgUrl'     : 'img/nibbler.jpg'
        };

        self.dmModel.creatureList[ self.dmModel.nextCreatureListId ] = newCreatureInfo;
        self.dmModel.nextCreatureListId++;
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

    self.refreshEncounterList = function() {
        self.clearEncounterCreatureList();
        activeCreatureList = dmToolModel.getCreatureListFromEncounter(self.dmModel.activeEncounterId);
        sortedCreatureList = activeCreatureList.sort(self.sortByInitiative);
        for ( var creatureId in sortedCreatureList ) {
            self.addCreatureToEncounterList(creatureId, sortedCreatureList[creatureId]);
        }
    }

    self.sortByInitiative = function(a, b) {
        return( b.initiative - a.initiative );
    }


    return self;
};


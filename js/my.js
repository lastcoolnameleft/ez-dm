window.dmtool = {};

window.dmtool.app = function () {
    var self = this;

    self.dmToolModel      = new window.dmtool.model();
    self.dmToolUi         = new window.dmtool.ui( self.dmToolModel );
    self.dmToolController = new window.dmtool.controller( self.dmToolModel, self.dmToolUi );
    self.dmToolDatafill   = new window.dmtool.datafill( self.dmToolController, self.dmToolModel, self.dmToolUi);

    //  I want to be able to see this!
    window.dmToolModel = self.dmToolModel;
    window.dmToolUi = self.dmToolUi;
    window.dmToolController = self.dmToolController;

    self.dmToolDatafill.setDummyData(self.dmToolModel);
    self.dmToolDatafill.datafillCreateFields();

    self.dmToolController.refreshEncounterList();
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
            if ( creatureList[key]['type'] == type ) {
               result.push(creatureList[key]);
            }
        }
        return result;
    }

    self.getPcList = function() {
        return getCreatureTypeFromList( 'pc' );
    }

    self.getNpcListList = function() {
        return getCreatureTypeFromList( 'npc' );
    }

    self.getEncounterList = function() {
        return encounterList;
    }

    self.updateCreature = function( id, creatureData ) {
        creatureToUpdate = self.getCreatureDataFromId(id);
        for ( key in creatureData ) {
            creatureList[id][key] = creatureData[key];
        }
    }

    self.setActiveCreatureList = function(creatureList) {
        this.activeCreatureList = creatureList;
    }

    self.getCreatureListFromEncounter = function(encounterId) {
        var creatureList = [];
    
        encounterData = self.getEncounterDataFromEncounterId( encounterId ); 
        var activeCreatureList = encounterData['creatureList'];
        for (id in activeCreatureList) {
            creatureList.push(self.getCreatureDataFromId(activeCreatureList[id]));
        }
        return creatureList;
    }

    self.getEncounterDataFromEncounterId = function ( encounterId ) {
        for ( id in self.encounterList) {
            if ( self.encounterList[id]['id'] == encounterId ) {
                return self.encounterList[id];
            }
        }
        return;
    }

    self.createEncounter = function( name ) {
        var encounterInfo = { 'id' : self.nextEncounterListId, 'name' : name, 'creatureList' : [] };
        self.encounterList.push( encounterInfo );
        self.nextEncounterListId++;
    }

    return self;
};

window.dmtool.controller = function( dmToolModel, dmToolUi ) {
    var self = this;

    self.dmModel = dmToolModel;
    self.dmUi    = dmToolUi;

    self.refreshEncounterList = function() {
        self.dmUi.clearEncounterCreatureList();
        activeCreatureList = dmToolModel.getCreatureListFromEncounter(self.dmModel.activeEncounterId);
        sortedCreatureList = activeCreatureList.sort(self.sortByInitiative);
        for ( var creatureId in sortedCreatureList ) {
            self.dmUi.addCreatureToEncounterList(creatureId, sortedCreatureList[creatureId]);
        }
    }

    self.sortByInitiative = function(a, b) {
        return( b.initiative - a.initiative );
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
        $('#popupEdit').on('popupbeforeposition', function () { self.datafillPopupSpecial('popupEditPc', 'popup', 'popupEditCreature', self.dmModel.getPcList()) });
        $('#popupEdit').on('popupbeforeposition', function () { self.datafillPopup('#popupEditNpc', 'popup', '#popupEditCreature', self.dmModel.getNpcList() ) });
        $('#popupEdit').on('popupbeforeposition', function () { self.datafillPopup('#popupEditEncounter', 'popup', '#popupEditEncounter', self.dmModel.getEncounterList() ) });
        $('#popupAdd').on('popupbeforeposition', function () { self.datafillPopup('#popupAddPc', 'dialog', 'addCreature.html', self.dmModel.getPcList() ) });
        $('#popupAdd').on('popupbeforeposition', function () { self.datafillPopup('#popupAddNpc', 'dialog', 'addCreature.html', self.dmModel.getNpcList() ) });
        $('#popupAdd').on('popupbeforeposition', function () { self.datafillPopup('#popupAddEncounter', 'dialog', '#popupAddEncounter', self.dmModel.getEncounterList() ) });
        $('#createPcButton').on('click', function () { self.submitCreateCreature() });
        $('#createNpcButton').on('click', function () { self.submitCreateCreature() });
        $('#createEncounterButton').on('click', function () { self.submitCreateEncounter() });

//  For asking initiative
        $('#popupAdd').on('popupbeforeposition', function () { self.datafillPopup('#popupAddPc', 'popup', '#popupAddCreature', self.dmModel.getPcList() ) });
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

    return self;
};


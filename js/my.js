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

    self.addCreatureToEncounter = function ( creatureId, encounterId ) {
        self.getEncounterDataFromEncounterId(encounterId)['creatureList'].push( creatureId );
    }

    self.addCreatureToActiveEncounter = function ( creatureId ) {
        self.addCreatureToEncounter( creatureId, self.getActiveEncounterId() );
    }

    self.removeCreatureFromEncounter = function ( encounterId, creatureId ) {
        self.getEncounterDataFromEncounterId(encounterId)['creatureList'] 
            = _.without(self.getEncounterDataFromEncounterId(encounterId)['creatureList'], creatureId);
    }

    self.getEncounterDataFromId = function ( encounterId ) {
        return _.find(self.getEncounterList(), function ( encounterData ) { return encounterData['id'] == encounterId });
    }

    self.getCreatureDataFromId = function ( creatureId ) {
        return _.find(self.getCreatureList(), function ( creatureData ) { return creatureData['id'] == creatureId });
    }

    self.getCreatureTypeFromList = function( type ) {
        return _.filter(self.getCreatureList(), function ( creatureData ) { return creatureData['type'] == type });
    }

    self.getCreatureListFromEncounterId = function (encounterId) {
        var creatureList = [];
    
        encounterData = self.getEncounterDataFromEncounterId( encounterId ); 
        var activeCreatureList = encounterData['creatureList'];
        for (var id in activeCreatureList) {
            creatureList.push(self.getCreatureDataFromId(activeCreatureList[id]));
        }
        return creatureList;
    }

    self.updateInitiative = function( creatureId, initiative ) {
        self.getCreatureDataFromId( creatureId ).initiative = parseInt(initiative);
    }

    self.addHitPoints = function( creatureId, hitPoints ) {
        self.getCreatureDataFromId( creatureId ).currentHp += parseInt(hitPoints);
    }

    self.removeHitPoints = function( creatureId, hitPoints ) {
        self.getCreatureDataFromId( creatureId ).currentHp -= parseInt(hitPoints);
    }

    self.setActiveEncounterId = function ( encounterId ) {
        self.activeEncounterId = encounterId;
    }

    self.getActiveEncounterData = function () {
        return self.getEncounterDataFromId(self.getActiveEncounterId());
    }

    self.getNonactivePcList = function () {
        return self.getNonActiveListFromCreatureList( self.getPcList() );
    }

    self.getNonactiveNpcList = function () {
        return self.getNonActiveListFromCreatureList( self.getNpcList() );
    }

    self.getNonActiveListFromCreatureList = function ( creatureList ) {
        var result = [];
        for ( index in creatureList ) {
            var creatureId = creatureList[index]['id'];
            var activeCreatureList = self.getActiveEncounterData()['creatureList'];
            var found = $.inArray(creatureId, activeCreatureList);
            if (found == -1 ) {
                result.push(self.getCreatureDataFromId( creatureId ) );
            } 
        }
        return result;
    }

    self.getCreatureList = function() {
        return self.creatureList;
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

    self.getActiveEncounterId = function () {
        return self.activeEncounterId;
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
        self.encounterList[self.nextEncounterListId] = encounterInfo ;
        self.nextEncounterListId++;
    }

    self.updateEncounter = function ( id, encounterData ) {
        encounterToUpdate = self.getEncounterDataFromId(id);
        for ( key in encounterData ) {
            encounterToUpdate[key] = encounterData[key];
        }
    }

    return self;
};

window.dmtool.ui = function( dmToolModel ) {
    var self = this;

    self.dmModel = dmToolModel;

    self.submitCreateEncounter = function() {
        $( "#createEncounter_popup" ).popup( "close" );
        var encounterName = $( '#createEncounter_popup_name' ).val();
        self.dmModel.createEncounter(encounterName);     
    }

    self.addEditCreatureTextToEncounterList = function ( creatureInfo ) { 
        var editEncounterCreatureDomId = 'editEncounterCreature_listItem_' + creatureInfo['id'];
        var liCount = '<span class="ui-li-count">AC: ' + creatureInfo['ac'] + ' For: ' + creatureInfo['fortitude'] + ' Ref: ' + creatureInfo['reflex'] + ' Wil: ' + creatureInfo['will'] + '</span>';
        var liLeftLink = '<a href="#" data-rel="popup"><img src="' + creatureInfo['imgUrl'] + '" /><h1>' + creatureInfo['name'] + '</h1><p>HP:' + creatureInfo['currentHp'] + '/' + creatureInfo['maxHp'] + ' Init:' + creatureInfo['initiative'] + '</p>' + liCount + '</a>';
        var liRightLink = '<a href="#" data-rel="popup" data-position-to="window" data-icon="delete" id="' + editEncounterCreatureDomId + '"></a>';

        var liString = '<li data-theme="c">' + liLeftLink + liRightLink + '</li>';

        $( '#encounterCreatureList' ).append(liString).listview("refresh");
        $('#' + editEncounterCreatureDomId ).on('click', self.clickRemoveEncounterCreature(creatureInfo['id']));
    }

    self.addCreatureTextToEncounterList = function ( creatureInfo ) { 
        var encounterCreatureDomId = 'encounterCreature_listItem_' + creatureInfo['id'];
        var liCount = '<span class="ui-li-count">AC: ' + creatureInfo['ac'] + ' For: ' + creatureInfo['fortitude'] + ' Ref: ' + creatureInfo['reflex'] + ' Wil: ' + creatureInfo['will'] + '</span>';
//        var liLeftLink = '<img src="' + creatureInfo['imgUrl'] + '" /><h1>' + creatureInfo['name'] + '</h1><p>HP:' + creatureInfo['currentHp'] + '/' + creatureInfo['maxHp'] + ' Init:' + creatureInfo['initiative'] + '</p>' + liCount;
        var liLeftLink = '<a href="#" data-rel="popup" data-icon="gear"><img src="' + creatureInfo['imgUrl'] + '" /><h1>' + creatureInfo['name'] + '</h1><p>HP:' + creatureInfo['currentHp'] + '/' + creatureInfo['maxHp'] + ' Init:' + creatureInfo['initiative'] + '</p>' + liCount + '</a>';

        var liString = '<li data-theme="c" data-icon="gear" id="' + encounterCreatureDomId + '">' + liLeftLink + '</li>';

        $( '#encounterCreatureList' ).append(liString).listview("refresh");
        $('#' + encounterCreatureDomId ).on('click', self.clickEditEncounterCreature( creatureInfo['id'] ));
    }

    self.clickRemoveEncounterCreature = function ( creatureId ) {
        return function() {
            self.dmModel.removeCreatureFromEncounter( self.dmModel.getActiveEncounterId(), creatureId );
            self.refreshEditEncounterList();
        };
    }

    self.clickEditEncounterCreature = function ( creatureId ) {
        return function() {
            self.datafillEditCreatureFormPopup(creatureId);
            $( '#popupEditCreatureEncounter' ).popup( 'open' );
            $( '#popupEditCreatureEncounterHurt' ).off( 'click' );
            $( '#popupEditCreatureEncounterHeal' ).off( 'click');
            $( '#popupEditCreatureEncounterSubmit' ).off( 'click' );
            $( '#popupEditCreatureEncounterHurt' ).on( 'click', self.clickPopupEditCreatureEncounterHurt( creatureId ) );
            $( '#popupEditCreatureEncounterHeal' ).on( 'click', self.clickPopupEditCreatureEncounterHeal( creatureId ) );
            $( '#popupEditCreatureEncounterSubmit' ).on( 'click', self.clickPopupEditCreatureEncounterSubmit( creatureId ) );
        };
    }

    self.clickPopupEditCreatureEncounterSubmit = function ( creatureId ) {
        return function() {
            $( '#popupEditCreatureEncounter' ).popup( 'close' );
            self.dmModel.updateInitiative( creatureId, $( '#popupEditCreatureEncounterInitiative' ).val() );
            self.refreshEncounterList();
        }
    }

    self.clickPopupEditCreatureEncounterHeal = function ( creatureId ) {
        return function() {
            $( '#popupEditCreatureEncounter' ).popup( 'close' );
            self.dmModel.addHitPoints( creatureId, $( '#popupEditCreatureEncounterValue' ).val() );
            self.refreshEncounterList();
        }
    }

    self.clickPopupEditCreatureEncounterHurt = function ( creatureId ) {
        return function() {
            $( '#popupEditCreatureEncounter' ).popup( 'close' );
            self.dmModel.removeHitPoints( creatureId, $( '#popupEditCreatureEncounterValue' ).val() );
            self.refreshEncounterList();
        }
    }

    self.setEncounterName = function(encounterName) {
        $( '#headerEncounterName' ).text( encounterName );
    }

    // http://stackoverflow.com/questions/8399882/jquery-mobile-collapsible-expand-collapse-event
    // http://jquerymobile.com/demos/1.2.0/docs/pages/popup/events.html
    self.addPopupBindings = function() {
        $('#addCreature_popup_submit').on('click', function () { self.submitAddCreatureToEncounter() });

        $('#createPc_listItem').on('click', function () { self.clickCreatePc() });
        $('#createNpc_listItem').on('click', function () { self.clickCreateNpc() });
        $('#createEncounter_listItem').on('click', function () { self.clickCreateEncounter() });

        $('#createCreature_button_submit').on('click', function () { self.submitCreateCreature() });
        $('#createEncounter_popup_submit').on('click', function () { self.submitCreateEncounter() });

        $('#create_button').on('click', function () { self.clickCreateButton() } );
        $('#add_button').on('click', function () { self.clickAddButton() } );
        $('#edit_button').on('click', function () { self.clickEditButton() } );
        $('#remove_button').on('click', function () { self.clickRemoveButton() } );
    }

    self.submitAddCreatureToEncounter = function() {
        var initiative = $( '#addCreature_popup_initiative' ).val();
        var creatureId = $( '#addCreature_popup_creatureId' ).val();
        var creatureData = self.dmModel.getCreatureDataFromId(creatureId);
        creatureData['initiative'] = initiative;
        self.dmModel.addCreatureToActiveEncounter(creatureId);
        $( "#addCreature_popup" ).popup( "close" );
        self.refreshEncounterList();
    }

    self.clickRemoveButton = function() {
//        $('#remove_button').buttonMarkup({ theme: "b" });
        $('#remove_button .ui-btn-text').text('Done');
        $('#remove_button').off('click');
        $('#remove_button').on('click', function () { self.clickDoneRemoveButton() } );
        self.refreshEditEncounterList();
    }

    self.clickDoneRemoveButton = function() {
        $('#remove_button .ui-btn-text').text('Remove');
//  Can't make this work properly.  Just leave blue
//        $('#remove_button').buttonMarkup({ theme: "a" });
        $('#remove_button').off('click');
        $('#remove_button').on('click', function () { self.clickRemoveButton() } );
        self.refreshEncounterList();
    }

    self.clickEditButton = function() {
        self.datafillPopupList('editPc_list', 'popup', self.dmModel.getPcList(), self.initPopupEditCreature );
        self.datafillPopupList('editNpc_list', 'popup', self.dmModel.getNpcList(), self.initPopupEditCreature );
        self.datafillPopupList('editEncounter_list', 'dialog', self.dmModel.getEncounterList(), self.initPopupEditEncounter )
        $( '#edit_popup' ).popup( 'open', { 'positionTo' : '#edit_button' } );
    }

    self.clickAddButton = function() {
        self.datafillPopupList('addPc_list', 'popup', self.dmModel.getNonactivePcList(), self.initPopupAddCreature );
        self.datafillPopupList('addNpc_list', 'popup', self.dmModel.getNonactiveNpcList(), self.initPopupAddCreature );
        self.datafillPopupList('addEncounter_list', 'dialog', self.dmModel.getEncounterList(), self.initPopupAddEncounter );
        $( '#add_popup' ).popup( 'open', { 'positionTo' : '#add_button' } );
    }

    self.datafillPopupList = function(divId, dataRel, list, onClickCallback) {
        $('#' + divId ).html('');
        for ( var id in list) {
            var domId = divId + '_' + id; 
            var name = list[id]['name'];
            var li = '<li><a href="#" id="' + domId + '" data-position-to="window" class="ui-btn-left" data-rel="' + dataRel + '">' + name + '</a></li>';
            $('#' + divId ).append(li).listview('refresh');
            $('#' + domId).on('click', self.clickClosureGenerator(onClickCallback, list[id]['id']));
        }
    }

    self.clickClosureGenerator = function ( callback, id ) {
        return function() {
            callback(id);
        }
    }

    self.clickCreateButton = function() {
        $( '#create_popup' ).popup( 'open', { 'positionTo' : '#create_button' } );
    }

    self.clickCreatePc = function () {  
        $( '#createCreature_popup_type' ).val('pc');
        self.popupReplace( '#create_popup', '#createEncounter_popup' );
    }

    self.clickCreateNpc = function () {
        $( '#createCreature_popup_type' ).val('npc');
        self.popupReplace( '#create_popup', '#createEncounter_popup' );
    }

    self.clickCreateEncounter = function () {
        self.popupReplace( '#create_popup', '#createEncounter_popup' );
    }

    self.popupReplace = function( closePopupDiv, openPopupDiv ) {
        $( closePopupDiv ).popup( 'close' );
        setTimeout( function(){ $( openPopupDiv ).popup( 'open' ) }, 100 );
    }

    self.initPopupEditEncounter = function ( encounterId ) {
        self.popupReplace( '#edit_popup', '#editEncounter_popup' );
        $( "#editEncounter_popup_encounterId" ).val( encounterId );
        var encounterData = self.dmModel.getEncounterDataFromId( encounterId );
        $( "#editEncounter_popup_name" ).val( encounterData['name'] );
        $('#editEncounter_popup_submit').off('click');
        $('#editEncounter_popup_submit').on('click', self.submitEditEncounter );
        $('#editEncounter_popup_cancel').on('click', function() {
            $( "#editEncounter_popup" ).popup( "close" );
        });
    }

    self.submitEditEncounter = function () {
        $( "#editEncounter_popup" ).popup( "close" );
        var encounterId = $( "#editEncounter_popup_encounterId" ).val();
        var encounterName = $( "#editEncounter_popup_name" ).val();
        self.dmModel.updateEncounter( encounterId, { 'name' : encounterName } );
        self.refreshEncounterList();
    }

    self.initPopupAddEncounter = function ( encounterId ) {
        self.popupReplace( '#add_popup', '#addEncounter_popup' );
        $('#addEncounter_popup_submit').off('click');
        $('#addEncounter_popup_submit').on('click', function() {
            $( "#addEncounter_popup" ).popup( "close" );
            self.dmModel.setActiveEncounterId( encounterId );
            self.refreshEncounterList();
        });
        $('#addEncounter_popup_cancel').on('click', function() {
            $( "#addEncounter_popup" ).popup( "close" );
        });
    }

    //  Init Edit Creature Popup
    self.initPopupAddCreature = function( creatureId ) {
        self.popupReplace( '#add_popup', '#addCreature_popup' );
        $('#addCreature_popup_creatureId').val(creatureId);
        $('#addCreature_popup_submit').off('click');
        $('#addCreature_popup_submit').on('click', function() { 
            $( "#addCreature_popup" ).popup( "close" );
            self.dmModel.addCreatureToActiveEncounter( creatureId );
            self.refreshEncounterList();
        });
    }

    //  Init Edit Creature Popup
    self.initPopupEditCreature = function( id ) {
        self.popupReplace( '#edit_popup', '#editCreature_popup' );
		var creatureData = self.dmModel.getCreatureDataFromId( id );
		self.datafillCreatureFields('editCreature_popup', creatureData); 
		$('#editCreature_button_submit').off('click');

        $('#editCreature_button_submit').on('click', function() { 
            $( "#editCreature_popup" ).popup( "close" );
            submitCreatureData = self.fetchCreatureDataFromFields('editCreature_popup');
            self.dmModel.updateCreature( id, submitCreatureData );
            self.refreshEncounterList();
        });
    }

    
    self.datafillAddCreatureListPopup = function(divId, dataRel, link, list) {
        $('#' + divId + ' ul').html('');
        for ( var id in list) {
            var domId = link + '_' + divId + '_' + id; 
            var name = list[id]['name'];
            var li = '<li><a href="#' + link + '" id="' + domId + '" data-position-to="window" class="ui-btn-left" data-rel="' + dataRel + '">' + name + '</a></li>';
            $('#' + divId + ' ul').append(li).listview('refresh');
            $('#' + domId).on('click', self.datafillAddCreatureFormPopup(list[id]['id']));
        }
    }

    self.datafillEditCreatureListPopup = function(divId, dataRel, link, list) {
        $('#' + divId ).html('');
        for ( var id in list) {
            var domId = link + '_' + divId + '_' + id; 
            var name = list[id]['name'];
            var li = '<li><a href="#' + link + '" id="' + domId + '" data-position-to="window" class="ui-btn-left" data-rel="' + dataRel + '">' + name + '</a></li>';
            $('#' + divId ).append(li).listview('refresh');
            $('#' + domId).on('click', self.datafillEditCreatureFormPopup(list[id]['id']));
        }
    }

    self.datafillAddCreatureFormPopup = function(creatureId) { 
        return function() {
            $('#addCreature_popup_creatureId').val(creatureId);
            $('#addCreature_popup_submit').off('click');
            $('#addCreature_popup_submit').on('click', function() { 
                $( "#addCreature_popup" ).popup( "close" );
                self.dmModel.addCreatureToActiveEncounter( creatureId );
                self.refreshEncounterList();
            });
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
        var fieldList = ['name', 'maxHp', 'ac', 'fortitude', 'reflex', 'will', 'level'];
        var creatureData = {};
        for ( id in fieldList )  {
            creatureData[fieldList[id]] = $( '#' + prefix + '_' + fieldList[id] ).val();
        }
        return creatureData;
    }

    self.submitCreateCreature = function() {
        //  Probably shouldn't close both.  
        $( "#createCreature_popup" ).popup( "close" );
        createCreatureData = self.fetchCreatureDataFromFields('createCreature_popup');
        createCreatureData['id'] = self.dmModel.nextCreatureListId;
        createCreatureData['initiative'] = 0;
        createCreatureData['imgUrl'] = 'img/nibbler.jpg';
        createCreatureData['type'] = $('#createCreature_popup_type').val();

        self.dmModel.creatureList[ self.dmModel.nextCreatureListId ] = createCreatureData;
        self.dmModel.nextCreatureListId++;
    }

    self.initializeAddCreature = function() {
        $(function(){
            $('#addCreature_popup_initiative').scroller({
                preset: 'select',
                theme: 'default',
                display: 'inline',
                mode: 'scroller',
                inputClass: 'i-txt'
            });

            //  Stupid mobiscroll.  Why do you add this dummy thing?
            $('#addCreature_popup_initiative_dummy').hide();
        });

    }

    self.refreshEncounterList = function() {
        self.doRefreshEncounterList( self.addCreatureTextToEncounterList );
    }

    self.refreshEditEncounterList = function() {
        self.doRefreshEncounterList( self.addEditCreatureTextToEncounterList );
    }

    self.doRefreshEncounterList = function( displayCreatureTextFunction ) {
        self.setEncounterName(self.dmModel.getEncounterDataFromEncounterId(self.dmModel.activeEncounterId)['name']);
        $( '#encounterCreatureList' ).empty();
        var activeCreatureList = dmToolModel.getCreatureListFromEncounterId(self.dmModel.activeEncounterId);
        var sortedCreatureList = activeCreatureList.sort(self.sortByInitiative);
        for ( var creatureId in sortedCreatureList ) {
            displayCreatureTextFunction( sortedCreatureList[creatureId]);
        }
    }

    self.sortByInitiative = function(a, b) {
        return( b.initiative - a.initiative );
    }

    return self;
};


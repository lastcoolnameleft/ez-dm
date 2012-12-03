initApp = function () {
    setDummyData();
    datafillCreateFields();
    addPopupBindings();
    activeCreatureList = getCreatureListFromEncounter(activeEncounterId, encounterList, pcList, npcList);
    addCreaturesToEncounterList(activeCreatureList);
    setEncounterName(encounterList[activeEncounterId]['name']);
}

addUser = function (name, currentHp, maxHp, initiative, ac, fortitude, reflex, will, imgUrl) {
    liString = '<li data-theme="c"><a href="#popupEditPcEncounter" data-rel="popup"><img src="' + imgUrl + '" /><h1>' + name + '</h1><p>HP:' + currentHp + '/' + maxHp + 'Init:' + initiative + '</p><span class="ui-li-count">AC: ' + ac + ' For: ' + fortitude + ' Ref: ' + reflex + ' Wil: ' + will + '</span></a><a href="#popupEditCreature" data-rel="popup"></a></li>';
    $( '#sortable' ).append(liString).listview("refresh");
}

setEncounterName = function(encounterName) {
    $( '#headerEncounterName' ).text( encounterName );
}

getCreatureListFromEncounter = function(encounterId, encounterList, pcList, npcList) {
    var creatureList = [];
 
    activePcList = encounterList[encounterId]['pcList'];
    for (pcId in activePcList) {
        creatureList.push(pcList[activePcList[pcId]]);
    }
    activeNpcList = encounterList[encounterId]['npcList'];
    for (npcId in activeNpcList) {
        creatureList.push(npcList[activeNpcList[npcId]]);
    }
    return creatureList;
}

sortByInitiative = function(a, b) {
    return( b.initiative - a.initiative );
}

setActiveCreatureList = function(creatureList) {
    activeCreatureList = creatureList;
}

getEncounterList = function() {
    return encounterList;
}


addCreaturesToEncounterList = function(creatureList) { 
    sortedCreatureList = creatureList.sort(sortByInitiative);
    for ( var creatureId in sortedCreatureList ) {
        addUser(creatureList[creatureId]['name'], creatureList[creatureId]['currentHp'], creatureList[creatureId]['maxHp'], creatureList[creatureId]['initiative'], creatureList[creatureId]['ac'], creatureList[creatureId]['fortitude'], creatureList[creatureId]['reflex'], creatureList[creatureId]['will'], creatureList[creatureId]['imgUrl']);
    }
}


datafillPopup = function(divId, dataRel, link, list) {
    $(divId + ' ul').html('');
    for ( id in list) {
        $(divId + ' ul').append('<li><a href="' + link + '" data-position-to="window" class="ui-btn-left" data-rel="' + dataRel + '">' + list[id]['name'] + '</a></li>').listview('refresh');
    }
}

submitCreateEncounter = function() {
    $( "#popupCreateEncounter" ).popup( "close" );
    var encounterName = $( '#createEncounterName' ).val();
    createEncounter(encounterName);     
}

submitCreatePc = function() {
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
    pcList[ nextPcListId ] = newPcInfo;
    nextPcListId++;
}

submitCreateNpc = function() {
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
    npcList[ nextNpcListId ] = newNpcInfo;
    nextNpcListId++;
}

// http://stackoverflow.com/questions/8399882/jquery-mobile-collapsible-expand-collapse-event
// http://jquerymobile.com/demos/1.2.0/docs/pages/popup/events.html
addPopupBindings = function() {
    $('#popupEdit').on('popupbeforeposition', function () { datafillPopup('#popupEditPc', 'popup', '#popupEditCreature', pcList) });
    $('#popupEdit').on('popupbeforeposition', function () { datafillPopup('#popupEditNpc', 'popup', '#popupEditCreature', npcList) });
    $('#popupEdit').on('popupbeforeposition', function () { datafillPopup('#popupEditEncounter', 'popup', '#popupEditEncounter', encounterList) });
    $('#popupAdd').on('popupbeforeposition', function () { datafillPopup('#popupAddPc', 'dialog', 'addCreature.html', pcList) });
    $('#popupAdd').on('popupbeforeposition', function () { datafillPopup('#popupAddNpc', 'dialog', 'addCreature.html', npcList) });
    $('#popupAdd').on('popupbeforeposition', function () { datafillPopup('#popupAddEncounter', 'dialog', '#popupAddEncounter', encounterList) });
    $('#createPcButton').on('click', function () { submitCreatePc() });
    $('#createNpcButton').on('click', function () { submitCreateNpc() });
    $('#createEncounterButton').on('click', function () { submitCreateEncounter() });
}

createPc = function( name, maxHp, initiative, ac, fortitude, reflex, will, imgUrl ) {
}

createEncounter = function( name ) {
    var encounterInfo = { 'name' : name, 'pcList' : [], 'npcList' : [] };
    encounterList[ nextEncounterListId ] = encounterInfo;
    nextEncounterListId++;
}

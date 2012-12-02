addUser = function (name, currentHP, maxHP, initiative, ac, fortitude, reflex, will, imgUrl) {
    liString = '<li data-theme="c"><a href="#popupEditPcEncounter" data-rel="popup"><img src="' + imgUrl + '" /><h1>' + name + '</h1><p>HP:' + currentHP + '/' + maxHP + 'Init:' + initiative + '</p><span class="ui-li-count">AC: ' + ac + ' For: ' + fortitude + ' Ref: ' + reflex + ' Wil: ' + will + '</span></a><a href="#popupEditCreature" data-rel="popup"></a></li>';
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


function sortByInitiative(a, b) {
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
        addUser(creatureList[creatureId]['name'], creatureList[creatureId]['currentHP'], creatureList[creatureId]['maxHP'], creatureList[creatureId]['initiative'], creatureList[creatureId]['ac'], creatureList[creatureId]['fortitude'], creatureList[creatureId]['reflex'], creatureList[creatureId]['will'], creatureList[creatureId]['imgUrl']);
    }
}


initApp = function () {
    setDummyData();
    addPopupBindings();
    activeCreatureList = getCreatureListFromEncounter(activeEncounterId, encounterList, pcList, npcList);
    addCreaturesToEncounterList(activeCreatureList);
    setEncounterName(encounterList[activeEncounterId]['name']);
}

datafillPopup = function(divId, dataRel, link, list) {
    $(divId + ' ul').html('');
    for ( id in list) {
        $(divId + ' ul').append('<li><a href="' + link + '" data-position-to="window" class="ui-btn-left" data-rel="' + dataRel + '">' + list[id]['name'] + '</a></li>').listview('refresh');
    }
}

// http://stackoverflow.com/questions/8399882/jquery-mobile-collapsible-expand-collapse-event
addPopupBindings = function() {
    $('#popupEditPc').bind('expand', function () { datafillPopup('#popupEditPc', 'popup', '#popupEditCreature', pcList) });
    $('#popupEditNpc').bind('expand', function () { datafillPopup('#popupEditNpc', 'popup', '#popupEditCreature', npcList) });
    $('#popupEditEncounter').bind('expand', function () { datafillPopup('#popupEditEncounter', 'popup', '#popupEditEncounter', encounterList) });
    $('#popupAddPc').bind('expand', function () { datafillPopup('#popupAddPc', 'dialog', 'addCreature.html', pcList) });
    $('#popupAddNpc').bind('expand', function () { datafillPopup('#popupAddNpc', 'dialog', 'addCreature.html', npcList) });
    $('#popupAddEncounter').bind('expand', function () { datafillPopup('#popupAddEncounter', 'dialog', '#popupAddEncounter', encounterList) });
}

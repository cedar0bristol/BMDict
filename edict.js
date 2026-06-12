var e = {
    "loadIt" : async function() {
		const ids = ["searchButton","results","word"];

		for(var i = 0; i < ids.length; i++) {
			e[ids[i]] = document.getElementById(ids[i]);
		}
		e.searchButton.addEventListener("click", e.clickSearch);
		// so we don't do a dom query later
		const response = await fetch("edict3");
		if (!response.ok) {
			alert(`edict did not load status ${response.status}`);
		}
		e.dictionary = await response.text();
		e.dictionaryLength = e.dictionary.length;
		// console.log(`dictionary length is ${e.dictionary.length}`);
    },
	"getMatch" : function(line, searchString) {
		const ind1 = line.indexOf(searchString);
		// console.log(`ind1 is ${ind1}`);
		const line1 = line.substring(0, ind1);
		const line2 = line.substring(ind1);
		return `${line1}<span>${searchString}</span>${line2}`;
	},
    "clickSearch" : function() {
		let matchCount = 0;
		let index = 0;
		const MATCH_COUNT = 10;
		const len = e.dictionaryLength;
		const searchString = e.word.value;
		let currentLineBegin = 0;
		let currentLineEnd = 0;
		const matches = [];
		while (matchCount < MATCH_COUNT && index < len){
			index = e.dictionary.indexOf(searchString, index);
			if (index < 0) { break; }
			// get the matched line
			for(let i2 = index; i2 > 0; i2--) {
				if (e.dictionary[i2] == "\n"){
					currentLineBegin = i2;
					break;
				}
			}
			for (let i2 = index; i2 < len; i2++) {
				if (e.dictionary[i2] == "\n") {
					currentLineEnd = i2;
					break;
				}
			}
			if (currentLineEnd > index) {
				index = currentLineEnd;
			}
			let theMatch = e.dictionary.substring(currentLineBegin, currentLineEnd).trim();
			theMatch = e.getMatch(theMatch, searchString);
			matches.push(theMatch);
			const matchesInner = matches.join("</p><p>");
			e.results.innerHTML = `<p>${matchesInner}</p>`;
			matchCount ++;
		}
	}
}
window.onload = e.loadIt;

var inlineElements = function() {
    var inlinedElements = document.getElementsByClassName('inlined');
    inlinedElements = Array.prototype.concat.apply([], inlinedElements); // copy
    for (var i = 0; i < inlinedElements.length; i++) {
        var div = inlinedElements[i];
        var span = document.createElement('span');
        span.innerHTML = div.children[0].innerHTML;
        var previous = div.previousElementSibling;
        var paragraph;
        if (previous.tagName.toLowerCase() === "p") {
            paragraph = previous;
        } else {
            paragraph = document.createElement('p');
            div.parentNode.insertBefore(paragraph, div);
        }
        div.remove();
        paragraph.innerHTML += ' ' + span.innerHTML + ' ';
        paragraph.classList.add("highlight");
        paragraph.classList.add("inlined");
        if (div.classList.contains('connectNext')) {
            paragraph.classList.add('connectNext');
        }
    }
}

var connectElements = function() {
    while (true) {
        var connectNextElements = document.getElementsByClassName('connectNext');
        if (connectNextElements.length == 0) break;
        var prefix = connectNextElements[0];
        var next = prefix.nextElementSibling;
        prefix.innerHTML += ' ' + next.innerHTML;
        next.remove();
        if (!next.classList.contains('connectNext')) {
            prefix.classList.remove('connectNext');
        }
    }
}

if (typeof window === "object") {
    inlineElements();
    connectElements();
}

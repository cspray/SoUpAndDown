# SoUpAndDown

A Google Chrome extension to retrieve the up/down vote count for any question or
answer on any Stack Exchange site...regardless of reputation earned on that site.

## Problem meet solution

The problem?  Not knowing how active or controversial a heated answer on a Stack Exchange
site really is unless you are above 1000 reputation.  Well, I'm not above 1k on a lot of sites
that I want to know this information.  So, I made SoUpAndDown.

## How to install

Just [download the Chrome extension at our downloads page](https://github.com/cspray/so-up-down/downloads)
and then double click the file.

Alternatively you could clone the [SoUpAndDown repo itself](http://github.com/cspray/so-up-down)
and then install the extension via the normal developer install.

## How it works

We take a look at your reputation for a given site, by checking the existence of
the HTML element matching the jQuery selector: `#hlinks-user .reputation-score`.
If it is found we use the value in that element for the reputation.  If the element
could not be found, which likely means you aren't logged in, we assume your reputation
to be zero.

If your reputation was determined to be **below 1000** we add our own, extension-specific
class to all HTML elements matching the jQuery selector: `.vote-count-post`.  Finally,
we add a click event handler to all elements matching this extension-specific class
that parses out the information needed to query the API and stick the up/down vote
count back into the appropriate question or answer.

Ultimately, it looks and feels just like the normal established-user privilege.

## Bugs?

Found an error?  Got some way to improve the code?  [Raise an issue](http://github.com/cspray/SoUpAndDown/issues).

**Created by [Charles Sprayberry](http://cspray.github.com/)**
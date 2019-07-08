# logorrhea

_noun_

A tendency to extreme loquacity.

_visual studio code extension_

An extension that is meant to help poring over with loquacious logs. It was put together in a couple of hours. Don't judge.

[Log File Highlighter](https://marketplace.visualstudio.com/items?itemName=emilast.LogFileHighlighter) is probably a LOT better. If only I had found out about it earlier, I probably wouldn't have spent a few precious hours creating _logorrhea_.

## Features

### Colorize specific words
1. select a word or string
2. right click -> set color
3. select a color in the list
4. congratulations, this word is now colored everywhere it's found

### Dim lines containing specific words
1. select a word or string
2. right click -> dim lines
3. congratulations, the lines containing this string are now "dimmed"

### Reset colors
1. select a word or string that is colored
2. right click -> reset colors
3. congratulations, the colorization for this string has been removed.

### Extract lines
1. select a word or a string
2. right click -> extract lines
3. congratulations, the files containing this string have been extracted to a new editor window

### Save colorization
1. Ctrl-Shift-P to bring up the command palette
2. type "save color scheme" or something like that
3. select the right command...
4. a configuration file is now opened with the current colorization scheme, merged with the current state of the config file if it already exists
5. save
6. congratulations, you will now be able to "reload" the colorization quickly for another file

### Load colorization
1. Ctrl-Shift-P to bring up the command palette
2. type "load color scheme" or something like that
3. select the right command...
4. congratulations, if a color scheme was previously saved, it is now applied to the current file

## Requirements

A healthy dose of courage. Those logs are long, and this extension isn't that great.

## Extension Settings

None.

## Known Issues

- switching tab will remove colorization
- probably slow
- could use some tests

## Contributing

Sure, if you feel like it. I'll happily review pull-requests.

## Release Notes

### 1.0.0-preview

Initial release of _logorrhea_.

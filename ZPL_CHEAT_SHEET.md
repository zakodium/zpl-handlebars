# ZPL cheat sheet

## Information on units

Commands take distances and sizes using "dots" as their unit. The following
table gives a conversion reference for different print resolutions:

| Dots/inch | Dots/mm |
| --------- | ------- |
| 152       | 6       |
| 203       | 8       |
| 300       | 11.8    |
| 608       | 24      |

## Printer configuration

These settings persist on the printer until it is restarted.

### `^CF`: Change default font

Format: `^CFf,h,w`

Parameters:

- `f`: font, A-Z0-9 (default: A)
- `h`: character height (default: 9)
- `w`: character width (default: 5)

### `^LH`: Label home position

Sets the origin for the label. Useful if the label is preprinted.

Format: `^CFx,y`

### `^LR`: Label reverse print

Reverses the printing of all subsequent fields.

Format: `^LRa` with a= N or Y.

### `^FW`: Field orientation

Sets the default orientation for all fields that have an orientation parameter.

Format: `^FWr,z`

Parameters:

- `r`: rotate field, N (normal), R (90°), I (180°), B (270°) (initial: N)
- `z`: justification, 0 (left), 1 (right), 2 (auto) (default: auto for `^TB` and left for other commands)

## General commands

### `^XA`, `^XZ`: Start and end of label

Every label must start with `^XA` and end with `^XZ`:

```zpl
^XA

...
Other commands
...

^XZ
```

### `^FX`: Comment

The `^FX` command is ignored up until the next `^` or `~` command and can be
used to add comments to a template.

```zpl
^FXIGNORED^FS
```

### `^FS`: Field separator

Used to denote the end of a field.

### `^FO`: Field origin

Sets the field origin relative to the label home position.

Format: `^FOx,y,z`

Parameters:

- `x`: x location (default: 0)
- `y`: y location (default: 0)
- `z`: justification, 0 (left), 1 (right), 2 (auto) (default: value of `^FW`)

### `^FR`: Field reverse print

If this command is used before a field, the color of the output will be the
reverse of its background.

## Text and graphic commands

### `^A`: Font

Specify the font used for the next `^FD` field.

Format: `^Afo,h,w`

Parameters:

- `f`: font name, A-Z0-9
- `o`: field orientation, N (normal), R (90°), I (180°), B (270°) (default: value of `^FW`)
- `h`: character height (default: value of `^CF`)
- `w`: character width (default: value of `^CF`)

### `^FD`: Field data string

Print any characters except `^` and `~` (max 3072 bytes).

Format: `^FDa`

```zpl
^FDMy text^FS
```

### `^FB`: Field block

Multi-line text with word wrap

Format: `^FDw,l,s,j,i`
- `w`: width in dots
- `l`: max number of lines in the block (oveflow is hidden)
- `s`: space in dots to add (or remove if number is negative) between lines
- `j`: justification of text: `L` for left `R` for right, `C` for center, `J` for justified

```zpl
^FB250,4^FDMulti line text.^FS
```

### `^GB`: Graphic box

This allows to draw boundary rectangles or lines.

Format: `^GBw,h,t,c,r`

Parameters:

- `w`: width (default: `t` or 1)
- `h`: height (default: `t` or 1)
- `t`: border thickness (default: 1)
- `c`: color, A or B (default: B)
- `r`: corner rounding, 0 to 8 (default: 0)

If `w` or `h` is zero, a line is drawn.  
A full rectangle can be drawn by setting the thickness to the width or height.

### `^GC`: Graphic circle

Format: `^GCd,t,c`

Parameters:

- `d`: diameter, minimum 3 (default: 3)
- `t`: thickness (default: 1)
- `c`: color, A or B (default: B)

## Bar codes

The data of the bar code is added after the `^B.` field with a `^FD` field.

### `^BY`: Bar code field default

Format: `^BYw,r,h`

Parameters:

- `w`: module width, 1 to 10 (default: 2)
- `r`: wide bar to narrow bar width ratio, 2.0 to 3.0 in 0.1 increments (default: 3.0)
- `h`: bar code height (default: 10)

### `^B3`: Code 39

Allowed characters: `0-9A-Z-.$/+%` and space.

Format: `^B3o,e,h,f,g`

Parameters:

- `o`: orientation, N (normal), R (90°), I (180°), B (270°) (default: value of `^FW`)
- `e`: Mod-43 check digit, Y or N (default: N)
- `h`: bar code height (default: set by `^BY`)
- `f`: print interpretation line, Y or N (default: Y)
- `g`: print interpretation line above code, Y or N (default: N)

### `^BC`: Code 128

Format: `^BCo,h,f,g,e`

Parameters:

- `o`: orientation, N (normal), R (90°), I (180°), B (270°) (default: value of `^FW`)
- `h`: bar code height (default: set by `^BY`)
- `f`: print interpretation line, Y or N (default: Y)
- `g`: print interpretation line above code, Y or N (default: N)
- `e`: UCC check digit, Y or N (default: N)

### `^BX`: Data matrix

Format: `^BXo,h,s,c,r,f,g,a`

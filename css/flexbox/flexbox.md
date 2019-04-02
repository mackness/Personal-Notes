### Flexbox

By default, content on a page flows vertically from top to bottom. In this example, we have an unordered list of links, similar to something that could be used as a web page navigation. I'm going to go ahead and remove the bullets from the list, by setting the list style to none on the unordered list. Then I'll set display to flex.


### Defining dimensions on flexbox children using flex-basis
all of the sizing properties are applied to the individual flex children and not to the flex container. the three properties are flex-grow, flex-shrink and flex-basis. 

`flex-basis`
But if I set the flex-basis to 150, it will override the set width, but it will not exceed the max width or go under the min width. In essence, what is happening here is a cascading hierarchy. If flex-basis is not set, it defaults to auto, which means look at the dimension corresponding to the flex-direction.

Since our flex-direction here is row, the corresponding dimension is width. If width is not set, it defaults to the content width of the element, which in this case is just the size of the word.

Because of the complexity this hierarchy can introduce, I recommend sticking with flex-basis, not setting a width for all flexbox children in row flex-direction or height for all column flex-direction children. It makes it easier to know where your dimension is being set. Flex-basis is the ideal size for the element along the flex-direction if it has enough room.

### Shorthand for flex sizing properties

`flex`: `flex-grow` | `flex-shrink` |  `flex-basis`

each property has a default

flex-grow: 1
flex-shrink: 1
flex-basis: 0 

note that if you are not using the shorthand flex-basis does not default to 0, it defaults to auto.

in the second example below, flex-basis is set to 20px becuase it's the only value that could possibly have a unit.

in the third example a unitless measurement is defined then a value with a unit is defined so flex-grow gets the unitless value and flex-basis gets the value with the unit and flex-shrink defaults to 1 since a value was not defined.

examples:
```css
.box {
    flex: 1;
    /*
        flex-grow: 1;
        flex-shrink: 1;
        flex-basis: 0;
    */
}

.box1 {
    flex: 20px;
    /*
        flex-grow: 1;
        flex-shrink: 1;
        flex-basis: 20px;
    */
}

.box2 {
    flex: 0 80px;
    /*
        flex-grow: 0;
        flex-shrink: 1;
        flex-basis: 80px;
    */
}
```


### Cheatsheet

| Property | Value |
| --- | --- |
| `flex` | flex / inline-flex
| `flex-direction` |  row / row-reverse / column-reverse
| `flex-wrap` | nowap / wrap / wrap-reverse
| `flex-flow` | row nowrap / column-reverse / column wrap / row-reverse / wrap-reverse
| `order` | -1 / 0 / 1
| `justify-content` | flex-start / flex-end / center / space-between / space-around / space-evenly
| `align-items` | flex-start / flex-end / center / baseline / stretch
| `align-self` | flex-start / flex-end / center / baseline / stretch
| `align-content` | flex-start / flex-end / center / space-between / space-around / space-evenly / stretch
| `flex-grow` | 0 / 1
| `flex-shrink` | 0 / 1
| `flex-basis` | content / same values as width or height properties


### Flexbox

By default, content on a page flows vertically from top to bottom. In this example, we have an unordered list of links, similar to something that could be used as a web page navigation. I'm going to go ahead and remove the bullets from the list, by setting the list style to none on the unordered list. Then I'll set display to flex.


### Defining dimensions on flexbox children using flex-basis
all of the sizing properties are applied to the individual flex children and not to the flex container. the three properties are flex-grow, flex-shrink and flex-basis. 

`flex-basis`
But if I set the flex-basis to 150, it will override the set width, but it will not exceed the max width or go under the min width. In essence, what is happening here is a cascading hierarchy. If flex-basis is not set, it defaults to auto, which means look at the dimension corresponding to the flex-direction.

Since our flex-direction here is row, the corresponding dimension is width. If width is not set, it defaults to the content width of the element, which in this case is just the size of the word.

Because of the complexity this hierarchy can introduce, I recommend sticking with flex-basis, not setting a width for all flexbox children in row flex-direction or height for all column flex-direction children. It makes it easier to know where your dimension is being set. Flex-basis is the ideal size for the element along the flex-direction if it has enough room.



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


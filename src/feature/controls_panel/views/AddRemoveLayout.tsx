import { useState, useCallback } from "react";
import { WidthProvider, Responsive } from "react-grid-layout";
import _ from "lodash";
import { AddRemoveLayoutItem } from "../types/AddRemoveLayoutItem";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

/**
 * This layout demonstrates how to use a grid with a dynamic number of elements.
 */
const AddRemoveLayout = ({ defaultProps, ...props }) => {
  const { layouts, columns, breakpoints } = props;

  const defaultItems = [0, 1, 2, 3, 4].map((i, key, list) => {
    return {
      i: i.toString(),
      x: i * 2,
      y: 0,
      w: 2,
      h: 2,
      add: i === list.length - 1,
    };
  });

  const [items, setItems] = useState<AddRemoveLayoutItem[]>(defaultItems);
  const [newCounter, setNewCounter] = useState(0);
  const [breakpoint, setBreakpoint] = useState(null);
  const [cols, setCols] = useState([]);
  const [layout, setLayout] = useState(null);

  const createElement = (el) => {
    const i = el.add ? "+" : el.i;
    return (
      <div key={i} data-grid={el}>
        {el.add ? (
          <span
            className="add text"
            onClick={onAddItem}
            title="You can add an item by clicking here, too."
          >
            Add +
          </span>
        ) : (
          <span className="text">{i}</span>
        )}
        <span
          className="remove"
          style={{
            position: "absolute",
            right: "2px",
            top: 0,
            cursor: "pointer",
          }}
          onClick={() => {
            onRemoveItem(i);
          }}
        >
          x
        </span>
      </div>
    );
  };

  const onAddItem = useCallback(() => {
    /*eslint no-console: 0*/
    console.log("adding", "n" + newCounter);
    console.log("items", items);

    setItems(
      // Add a new item. It must have a unique key!
      items.concat({
        i: "n" + newCounter,
        // x: (items.length * 2) % (cols || 12),
        x: (items.length * 2) % (cols.length || 12),
        y: Infinity, // puts it at the bottom
        w: 2,
        h: 2,
      })
    );

    // Increment the counter to ensure key is always unique.
    setNewCounter(newCounter + 1);
  }, [items, newCounter]);

  // We're using the cols coming back from this to calculate where to add new items.
  const onBreakpointChange = (breakpoint, cols) => {
    setBreakpoint(breakpoint);
    setCols(cols);
  };

  const onLayoutChange = (layout) => {
    setLayout(layout);
  };

  const onRemoveItem = useCallback(
    (i) => {
      console.log("removing", i);
      setItems(_.reject(items, { i: i }));
    },
    [items]
  );

  return (
    <div>
      <button onClick={onAddItem}>Add Item</button>
      <ResponsiveReactGridLayout
        onLayoutChange={onLayoutChange}
        onBreakpointChange={onBreakpointChange}
        layouts={layouts}
        cols={columns}
        breakpoints={breakpoints}
      >
        {_.map(items, (el) => createElement(el))}
      </ResponsiveReactGridLayout>
    </div>
  );
};

export default AddRemoveLayout;

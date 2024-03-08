export const calculateContextMenuOffset = (
  clickX: number,
  clickY: number,
  flow: HTMLDivElement,
) => {
  // Calculate position of the context menu. We want to make sure it
  // doesn't get positioned off-screen.
  const pane = flow.getBoundingClientRect();

  const contextMenuHeight = 200;
  const paneToBlock = clickY - contextMenuHeight;

  let top: number | undefined = undefined;
  let bottom: number | undefined = undefined;

  if (paneToBlock < contextMenuHeight / 2) {
    top = paneToBlock;
  } else if (paneToBlock < contextMenuHeight) {
    if (pane.height - paneToBlock < contextMenuHeight) {
      top = contextMenuHeight - paneToBlock;
    } else {
      top = paneToBlock;
    }
  } else if (pane.height - paneToBlock < contextMenuHeight) {
    top = undefined;
    bottom = pane.height - paneToBlock;
  } else {
    top = paneToBlock;
  }

  return {
    top,
    left: clickX < pane.width - 200 ? clickX : undefined,
    right: clickX >= pane.width - 200 ? pane.width - clickX : undefined,
    bottom,
  };
};

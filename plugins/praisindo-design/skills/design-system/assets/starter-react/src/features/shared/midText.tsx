// A text on one line: when it does not fit it is cut in the middle with an ellipsis and its last word stays visible (rule TB-20; the markup `.mid`, `.mid-s`, `.mid-e` of the table kit). Used by the product cell and the labels of the sidebar (SB-34).
export const midText = (s: string) => {
  const i = s.lastIndexOf(' ');
  return i < 1 ? <span className="mid"><span className="mid-s">{s}</span></span> : <span className="mid"><span className="mid-s">{s.slice(0, i)}</span><span className="mid-e">{s.slice(i)}</span></span>;
};

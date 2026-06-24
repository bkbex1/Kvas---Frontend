export default function DoughKneadingAnimation() {
  return (
    <div className="dough-scene" aria-hidden="true">
      <div className="flour-dust flour-dust-1" />
      <div className="flour-dust flour-dust-2" />
      <div className="flour-dust flour-dust-3" />
      <div className="flour-dust flour-dust-4" />
      <div className="flour-dust flour-dust-5" />

      <div className="wood-board">
        <div className="dough-blob">
          <div className="dough-shine" />
        </div>

        <div className="hand hand-left">
          <span className="palm" />
          <span className="finger f1" />
          <span className="finger f2" />
          <span className="finger f3" />
        </div>

        <div className="hand hand-right">
          <span className="palm" />
          <span className="finger f1" />
          <span className="finger f2" />
          <span className="finger f3" />
        </div>
      </div>

      <p className="knead-caption">* месим, месим, месим... *</p>
    </div>
  );
}

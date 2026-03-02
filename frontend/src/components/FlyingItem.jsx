function FlyingItem({ flyingItem }) {
  if (!flyingItem) return null;

  return (
    <div
      className="flying-item"
      style={{
        '--start-x': `${flyingItem.startX}px`,
        '--start-y': `${flyingItem.startY}px`,
        '--end-x': `${flyingItem.endX}px`,
        '--end-y': `${flyingItem.endY}px`,
      }}
    >
      <img src={flyingItem.img} alt="" />
    </div>
  );
}

export default FlyingItem;

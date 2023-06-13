// eslint-disable-next-line react/require-default-props
export default function Spinner({ className }: { className?: string }) {
  return (
    <div className={`text-center${className ? ` ${className}` : ""}`}>
      <div className="spinner-border text-secondary" role="status">
        <span className="visually-hidden">加载中...</span>
      </div>
    </div>
  );
}

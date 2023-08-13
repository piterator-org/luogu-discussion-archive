export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="row px-2 px-md-0">
      <div className="col-lg-7 col-md-8 col-12 my-2 mx-auto">{children}</div>
    </div>
  );
}

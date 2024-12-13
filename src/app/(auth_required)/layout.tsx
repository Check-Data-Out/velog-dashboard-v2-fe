const layouts = [{ icon: 'test', title: '내 통계' }];
export default function Layout({ children }: { children: React.ReactElement }) {
  return (
    <main className="w-full h-full flex flex-col p-[60px_70px_70px_70px]">
      <nav>
        <ul>
          <ol></ol>
        </ul>
      </nav>
      {children}
    </main>
  );
}

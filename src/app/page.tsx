import QuitItTodayButton from './components/home/QuitItTodayButton';

export default function Home() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-8'>
      <main className='flex flex-col items-center gap-12 text-center'>
        <div className='space-y-4'>
          <h1 className='text-4xl md:text-6xl font-bold text-foreground'>
            Anti-Social Media
          </h1>
          <p className='text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl'>
            Today is the day to quit social media. Focus on what truly matters.
          </p>
        </div>

        <QuitItTodayButton />
      </main>
    </div>
  );
}

// app/cv/page.tsx
const CV_PATH = "/docs/Dylan_Ritchings_CV.pdf"

export default function CV() {
  return (
    <div className="mx-auto p-6 text-center">
      <div className="w-full h-screen flex flex-col items-center justify-start p-4">
        <iframe
          src={CV_PATH}
          className="w-full h-[80vh] border rounded"
          title="Dylan Ritchings CV"
        />
      </div>
    </div >
  );
}

// <a
//   href={CV_PATH}
//   download
//   className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition"
// >
//   Download CV
// </a>

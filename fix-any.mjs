import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function processFile(filePath) {
  if (!filePath.endsWith('.ts') && !filePath.endsWith('.tsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 1. catch (error: any) -> catch (error: unknown)
  // And replace error.message with (error instanceof Error ? error.message : "Error desconocido")
  if (content.includes('catch (error: any)')) {
    content = content.replace(/catch \(error: any\)/g, 'catch (error: unknown)');
    // replace `error.message` with `(error instanceof Error ? error.message : "Error desconocido")` but only in simple cases
    // actually safer to just do `error instanceof Error ? error.message : String(error)`
    content = content.replace(/error\.message/g, '(error instanceof Error ? error.message : "Error desconocido")');
  }

  if (content.includes('catch (e: any)')) {
    content = content.replace(/catch \(e: any\)/g, 'catch (e: unknown)');
    content = content.replace(/e\.message/g, '(e instanceof Error ? e.message : "Error desconocido")');
  }
  
  if (content.includes('catch (err: any)')) {
    content = content.replace(/catch \(err: any\)/g, 'catch (err: unknown)');
    content = content.replace(/err\.message/g, '(err instanceof Error ? err.message : "Error desconocido")');
  }

  // 2. React.FormEvent
  if (content.includes('onSubmit(e: any)')) {
    content = content.replace(/onSubmit\(e: any\)/g, 'onSubmit(e: React.FormEvent<HTMLFormElement>)');
  }
  if (content.includes('async function (e: any)')) { // NextJS forms might use actions
    content = content.replace(/\(e: any\)/g, '(e: React.FormEvent<HTMLFormElement>)');
  }

  // 3. prevState: any in server actions
  if (content.includes('prevState: any')) {
    // Keep it generic since it's Next.js standard for useFormState to be generic or any
    content = content.replace(/prevState: any/g, 'prevState: unknown');
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed', filePath);
  }
}

walkDir('./src', processFile);

import { Certificate } from "./../entities/certificate.entity";
import { initVector, ngrockHost } from "./../config/index";
import { encrypt, decrypt } from "../utils/crypt";
import { generateQR } from "../utils/qr-generate";
import { sendMail } from "../utils/send-mail";
import { myDataSource } from "../app-data-source";

export async function createCertificate(data: any) {
  data.accept = false;
  data.createDate = Date.now();

  await myDataSource.getRepository(Certificate).save(data);

  const encryptId = encrypt(data.id); //должна быть строка
  const url = `${ngrockHost}/close-certificate/?encryptId=${encryptId}`;
  console.log(url);
  const qr: Buffer = await generateQR(url);
  await sendMail(data.email, "QR код вашего сертификата", qr);
}

export async function acceptCertificate(encryptId: string) {
  let id;
  try {
    id = decrypt(encryptId);
  } catch (error) {
    throw new Error("Данные не корректны");
  }
  const certificate: Certificate | null = await myDataSource
    .getRepository(Certificate)
    .findOneBy({ id });
  if (!certificate) {
    throw new Error("Данные не корректны");
  }

  if (certificate.accept) {
    throw new Error("Сертификат уже погашен");
  }
  certificate.accept = true;
  await myDataSource.getRepository(Certificate).save(certificate);
  return {
    email: certificate.email,
    price: certificate.price,
    restaurant: certificate.restaurant,
  };
}

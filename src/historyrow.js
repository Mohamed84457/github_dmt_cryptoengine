export default function Historyrow({
  plaintext,
  ciphertext,
  k,
  crypto_type,
  encodeordecode,
  time,
  date,
}) {
  console.log(k);
  return (
    <tr>
      <td>{plaintext}</td>
      <td>{crypto_type}</td>
      <td>{k.key ? ` key:${k.key}` : `a:${k.a}  b:${k.b}`}</td>
      <td>{encodeordecode}</td>
      <td>{ciphertext}</td>
      <td>{date}</td>
      <td>{time}</td>
    </tr>
  );
}

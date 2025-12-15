import { Attachment, AttachmentBuilder, Collection, Snowflake } from 'discord.js';

export async function preserveAttachment(attachment: Attachment): Promise<AttachmentBuilder | null> {
  try {
    const response = await fetch(attachment.url);
    if (!response.ok) return null;

    const buffer = Buffer.from(await response.arrayBuffer());
    const builder = new AttachmentBuilder(buffer, {
      name: attachment.name ?? `attachment_${attachment.id}`,
      description: attachment.description ?? undefined,
    });

    if (attachment.spoiler) {
      builder.setSpoiler(true);
    }

    return builder;
  } catch {
    return null;
  }
}

export async function preserveAttachments(
  attachments: Collection<Snowflake, Attachment> | Attachment[]
): Promise<AttachmentBuilder[]> {
  const attachmentArray = Array.isArray(attachments) 
    ? attachments 
    : Array.from(attachments.values());

  const preserved: AttachmentBuilder[] = [];

  for (const attachment of attachmentArray) {
    const builder = await preserveAttachment(attachment);
    if (builder) {
      preserved.push(builder);
    }
  }

  return preserved;
}

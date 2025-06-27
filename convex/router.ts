import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// Invitation acceptance endpoint
http.route({
  path: "/accept-invitation",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return new Response("Invalid invitation link", { status: 400 });
    }

    try {
      const invitation = await ctx.runQuery(api.invitations.getInvitationByToken, { token });
      
      if (!invitation) {
        return new Response("Invitation not found or expired", { status: 404 });
      }

      // Redirect to frontend with token
      const frontendUrl = process.env.CONVEX_SITE_URL || "http://localhost:5173";
      return Response.redirect(`${frontendUrl}/accept-invitation?token=${token}`);
    } catch (error) {
      return new Response("Error processing invitation", { status: 500 });
    }
  }),
});

export default http;
